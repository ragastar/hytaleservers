import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  type: string;
  category: string;
  label: string | null;
  description: string | null;
  history: any[];
  current_version: number;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
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

    const { data: settings, error } = await supabase
      .from('site_settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (error) {
      console.error('Settings fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch settings', details: error.message },
        { status: 500 }
      );
    }

    const categories: Record<string, SiteSetting[]> = {};

    settings?.forEach((setting) => {
      if (!categories[setting.category]) {
        categories[setting.category] = [];
      }
      categories[setting.category].push(setting);
    });

    return NextResponse.json({
      settings: settings || [],
      categories
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
