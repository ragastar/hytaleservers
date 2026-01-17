import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: server, error } = await supabase
      .from('servers')
      .select(`
        *,
        categories (
          id,
          name,
          slug,
          icon
        )
      `)
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error || !server) {
      return NextResponse.json(
        { error: 'Server not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ server });
  } catch (error) {
    console.error('Error fetching server:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();
    
    // Проверить авторизацию
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Проверить, что пользователь владелец сервера
    const { data: server } = await supabase
      .from('servers')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (server?.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Обновить сервер (только разрешённые поля)
    const updateData: any = {};
    
    if (body.name) updateData.name = body.name;
    if (body.ip) updateData.ip = body.ip;
    if (body.port !== undefined) updateData.port = body.port;
    if (body.short_description !== undefined) updateData.short_description = body.short_description;
    if (body.full_description !== undefined) updateData.full_description = body.full_description;
    if (body.logo_url !== undefined) updateData.logo_url = body.logo_url;
    if (body.banner_url !== undefined) updateData.banner_url = body.banner_url;
    if (body.website_url !== undefined) updateData.website_url = body.website_url;
    if (body.discord_url !== undefined) updateData.discord_url = body.discord_url;

    // Обновить категории если переданы
    if (body.categories && Array.isArray(body.categories)) {
      // Удалить старые категории
      await supabase
        .from('server_categories')
        .delete()
        .eq('server_id', id);

      // Добавить новые категории
      if (body.categories.length > 0) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .in('slug', body.categories);

        if (categoryData) {
          const serverCategories = categoryData.map((cat: any) => ({
            server_id: id,
            category_id: cat.id
          }));

          await supabase
            .from('server_categories')
            .insert(serverCategories);
        }
      }
    }

    // Обновить сервер
    const { data: updatedServer, error } = await supabase
      .from('servers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update server:', error);
      return NextResponse.json(
        { error: 'Failed to update server', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      server: updatedServer
    });
  } catch (error) {
    console.error('Error updating server:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Проверить авторизацию
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Проверить, что пользователь владелец сервера
    const { data: server } = await supabase
      .from('servers')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (server?.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Удалить связи с категориями
    await supabase
      .from('server_categories')
      .delete()
      .eq('server_id', id);

    // Удалить сервер
    const { error } = await supabase
      .from('servers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete server:', error);
      return NextResponse.json(
        { error: 'Failed to delete server', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Server deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting server:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
