import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
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
      .single();

    if (error) {
      console.error('Server fetch error:', error);
      return NextResponse.json(
        { error: 'Server not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Server error:', error);
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
    const { status, name, ip, port, short_description, full_description } = body;

    const supabase = await createClient();

    const updateData: any = {};
    
    if (status) {
      if (!['pending', 'approved', 'rejected', 'offline'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (name) updateData.name = name;
    if (ip) updateData.ip = ip;
    if (port) updateData.port = port;
    if (short_description !== undefined) updateData.short_description = short_description;
    if (full_description !== undefined) updateData.full_description = full_description;

    const { data, error } = await supabase
      .from('servers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Server update error:', error);
      return NextResponse.json(
        { error: 'Failed to update server', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      server: data
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
