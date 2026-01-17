import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  validateImageFile,
  validateImageDimensions,
  generateImageFilename,
  getStorageBucketName,
  ImageType
} from '@/lib/utils/image';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as ImageType;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    if (!type || (type !== 'logo' && type !== 'banner')) {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "logo" or "banner"' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const fileValidation = validateImageFile(file, type);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    const dimensionsValidation = await validateImageDimensions(file, type);
    if (!dimensionsValidation.valid) {
      return NextResponse.json(
        { error: dimensionsValidation.error },
        { status: 400 }
      );
    }

    const bucket = getStorageBucketName(type);
    const filename = generateImageFilename(user.id, type, file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
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
      .from(bucket)
      .getPublicUrl(filename)
      .data.publicUrl;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filename
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}