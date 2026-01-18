import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ key: string; version: string }> }
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

    const params = await context.params;
    const targetVersion = parseInt(params.version);

    const { data: setting, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', params.key)
      .single();

    if (fetchError || !setting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    const history = setting.history || [];
    const targetVersionData = history.find((h: any) => h.version === targetVersion);

    if (!targetVersionData) {
      return NextResponse.json(
        { error: `Version ${targetVersion} not found in history` },
        { status: 404 }
      );
    }

    const newHistory = [...history];
    newHistory.unshift({
      version: setting.current_version,
      value: setting.value,
      changed_by: setting.updated_by || 'system',
      changed_at: setting.updated_at
    });

    const { data: updatedSetting, error: updateError } = await supabase
      .from('site_settings')
      .update({
        value: targetVersionData.value,
        history: newHistory,
        current_version: setting.current_version + 1,
        updated_by: adminUser.id,
        updated_at: new Date().toISOString()
      })
      .eq('key', params.key)
      .select()
      .single();

    if (updateError) {
      console.error('Rollback error:', updateError);
      return NextResponse.json(
        { error: 'Failed to rollback setting', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Rolled back to version ${targetVersion}`,
      setting: updatedSetting
    });
  } catch (error) {
    console.error('Rollback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
