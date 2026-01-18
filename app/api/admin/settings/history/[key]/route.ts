import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface SettingHistory {
  version: number;
  value: any;
  changed_by: string | null;
  changed_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const supabase = await createClient();

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .single();

    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: setting, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', params.key)
      .single();

    if (error || !setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    const history: SettingHistory[] = setting.history || [];

    return NextResponse.json({
      setting,
      history
    });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
