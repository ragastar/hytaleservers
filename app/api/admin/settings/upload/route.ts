import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateImageFile, validateImageDimensions, formatFileSize } from '@/lib/utils/image';

interface SiteImageType extends 'home_banner' | 'site_logo' | 'site_favicon' | 'page_banner';

const IMAGE_LIMITS: Record<SiteImageType, { maxSize: number; maxWidth: number; maxHeight: number; label: string }> = {
  home_banner: { maxSize: 5 * 1024 * 1024, maxWidth: 1200, maxHeight: 400, label: 'Баннер главной страницы' },
  site_logo: { maxSize: 2 * 1024 * 1024, maxWidth: 512, maxHeight: 512, label: 'Логотип сайта' },
  site_favicon: { maxSize: 512 * 1024, maxWidth: 64, maxHeight: 64, label: 'Favicon' },
  page_banner: { maxSize: 5 * 1024 * 1024, maxWidth: 1920, maxHeight: 600, label: 'Баннер страницы' }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = formData.get('key') as SiteImageType;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!key || !IMAGE_LIMITS[key]) {
      return NextResponse.json(
        { error: 'Invalid image key. Valid keys: home_banner, site_logo, site_favicon, page_banner' },
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

    const limits = IMAGE_LIMITS[key];

    if (!limits.allowedTypes?.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: PNG, JPG, WEBP, GIF` },
        { status: 400 }
      );
    }

    if (file.size > limits.maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${formatFileSize(limits.maxSize)}` },
        { status: 400 }
      );
    }

    const dimensions = await getImageDimensions(file);

    if (dimensions.width > limits.maxWidth || dimensions.height > limits.maxHeight) {
      return NextResponse.json(
        { error: `Image too large. Maximum: ${limits.maxWidth}x${limits.maxHeight}px` },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filename = `site-assets/${timestamp}-${key}.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image', details: uploadError.message },
        { status: 500 }
      );
    }

    const publicUrl = supabase.storage
      .from('site-assets')
      .getPublicUrl(filename)
      .data.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filename
    });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
