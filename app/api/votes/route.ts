import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { server_id, user_agent } = body;
    
    if (!server_id) {
      return NextResponse.json(
        { error: 'Server ID is required' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Получаем IP адрес клиента
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                '127.0.0.1';
    
    // Проверяем авторизацию
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = user.id;
    const userAgent = user_agent || request.headers.get('user-agent');
    
    // Проверка: голосовал ли сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('server_id', server_id)
      .eq('user_id', userId)
      .gte('voted_at', today.toISOString())
      .maybeSingle();
    
    if (existingVote) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Вы уже голосовали сегодня за этот сервер',
          serverVoteCount: 0 
        },
        { status: 429 }
      );
    }
    
    // Добавление голоса
    const { data: vote, error: insertError } = await supabase
      .from('votes')
      .insert({
        server_id,
        user_id: userId,
        ip_address: ip,
        user_agent: userAgent,
        voted_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to add vote', details: insertError.message },
        { status: 500 }
      );
    }
    
    // Обновление счетчика в таблице servers
    const { data: server } = await supabase
      .from('servers')
      .select('id, total_votes')
      .eq('id', server_id)
      .single();
    
    if (server) {
      await supabase
        .from('servers')
        .update({ total_votes: (server.total_votes || 0) + 1 })
        .eq('id', server_id);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Голос учтен!',
      serverVoteCount: (server?.total_votes || 0) + 1
    });
    
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
