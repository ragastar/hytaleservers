import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: servers, error } = await supabase
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
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch user servers:', error);
      return NextResponse.json(
        { error: 'Не удалось загрузить серверы' },
        { status: 500 }
      );
    }

    // Получить статистику пользователя
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    return NextResponse.json({
      servers: servers || [],
      stats: stats || {
        total_servers: 0,
        total_online: 0,
        total_votes: 0,
      },
    });
  } catch (error) {
    console.error('Error in my-servers:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Получить лимит серверов
    const { data: limitData } = await supabase
      .from('user_server_limits')
      .select('max_servers')
      .eq('user_id', user.id)
      .single();

    const maxServers = limitData?.max_servers || 3;

    // Посчитать текущее количество серверов
    const { data: currentServers } = await supabase
      .from('servers')
      .select('id')
      .eq('owner_id', user.id);

    const currentCount = currentServers?.length || 0;

    // Проверить лимит
    if (currentCount >= maxServers) {
      return NextResponse.json(
        { 
          error: `Вы достигли лимита серверов (${maxServers}).`,
          limit: maxServers,
          current: currentCount 
        },
        { status: 400 }
      );
    }

    // Создать сервер
    const body = await request.json();
    const serverData = {
      ...body,
      owner_id: user.id,
      status: 'pending',
      current_players: 0,
      max_players: body.max_players || 100,
      total_votes: 0,
      rating: 0,
      uptime_percentage: 0,
    };

    const { data, error } = await supabase
      .from('servers')
      .insert(serverData)
      .select()
      .single();

    if (error) {
      console.error('Failed to create server:', error);
      return NextResponse.json(
        { error: 'Не удалось создать сервер' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      server: data
    });
  } catch (error) {
    console.error('Error in my-servers POST:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
