import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ key: string }> }
) {
  try {
    const { value } = await request.json();

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Value is required' },
        { status: 400 }
      );
    }

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

    const { data: currentSetting, error: fetchError } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', params.key)
      .single();

    if (fetchError || !currentSetting) {
      return NextResponse.json(
        { error: 'Setting not found' },
        { status: 404 }
      );
    }

    const history = currentSetting.history || [];
    history.unshift({
      version: currentSetting.current_version,
      value: currentSetting.value,
      changed_by: currentSetting.updated_by || 'system',
      changed_at: currentSetting.updated_at
    });

    const { data: updatedSetting, error: updateError } = await supabase
      .from('site_settings')
      .update({
        value,
        history,
        current_version: currentSetting.current_version + 1,
        updated_by: adminUser.id,
        updated_at: new Date().toISOString()
      })
      .eq('key', params.key)
      .select()
      .single();

    if (updateError) {
      console.error('Settings update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update setting', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Setting updated successfully',
      setting: updatedSetting
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
