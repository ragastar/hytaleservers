export type ImageType = 'logo' | 'banner';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageLimits {
  maxSize: number;
  maxWidth: number;
  maxHeight: number;
  allowedTypes: string[];
}

export const IMAGE_LIMITS: Record<ImageType, ImageLimits> = {
  logo: {
    maxSize: 2 * 1024 * 1024, // 2MB
    maxWidth: 512,
    maxHeight: 512,
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  },
  banner: {
    maxSize: 5 * 1024 * 1024, // 5MB
    maxWidth: 1920,
    maxHeight: 600,
    allowedTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  }
};

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function getImageLimits(type: ImageType): ImageLimits {
  return IMAGE_LIMITS[type];
}

export function validateImageFile(file: File, type: ImageType): ImageValidationResult {
  const limits = getImageLimits(type);

  if (!limits.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Неверный тип файла. Разрешены: ${limits.allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')}`
    };
  }

  if (file.size > limits.maxSize) {
    return {
      valid: false,
      error: `Файл слишком большой. Максимум: ${formatFileSize(limits.maxSize)}`
    };
  }

  return { valid: true };
}

export async function validateImageDimensions(
  file: File,
  type: ImageType
): Promise<ImageValidationResult> {
  const limits = getImageLimits(type);

  try {
    const dimensions = await getImageDimensions(file);

    if (dimensions.width > limits.maxWidth || dimensions.height > limits.maxHeight) {
      return {
        valid: false,
        error: `Изображение слишком большое. Максимум: ${limits.maxWidth}x${limits.maxHeight}px`
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Не удалось прочитать изображение'
    };
  }
}

export function getImageDimensions(file: File): Promise<ImageDimensions> {
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

export function generateImageFilename(userId: string, type: ImageType, originalName: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop()?.toLowerCase() || 'png';
  return `${userId}/${timestamp}-${type}.${extension}`;
}

export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function isImage(url: string): boolean {
  return /\.(png|jpe?g|webp|gif)$/i.test(url);
}

export function getStorageBucketName(type: ImageType): string {
  return type === 'logo' ? 'server-logos' : 'server-banners';
}