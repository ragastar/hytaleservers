import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('servers')
    .select('id, name')
    .limit(1);

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorDetails: JSON.stringify(error)
    });
  }

  return NextResponse.json({
    success: true,
    data,
    envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
  });
}
