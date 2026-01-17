'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePreview } from '@/components/ui/ImagePreview';
import { toast } from 'sonner';
import {
  ImageType,
  formatFileSize,
  getImageLimits,
  validateImageFile,
  isImage
} from '@/lib/utils/image';

interface ImageUploaderProps {
  type: ImageType;
  label: string;
  value?: string;
  onChange: (url: string) => void;
}

export function ImageUploader({ type, label, value, onChange }: ImageUploaderProps) {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const limits = getImageLimits(type);

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);

    const validation = validateImageFile(file, type);
    if (!validation.valid) {
      setError(validation.error || null);
      return;
    }

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
      toast.success('Изображение успешно загружено');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [type, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    } else {
      setError('Пожалуйста, перетащите изображение');
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url && isImage(url)) {
      setPreview(url);
      onChange(url);
    } else {
      setPreview(null);
      onChange(url);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadAreaSize = type === 'logo' ? 'h-32' : 'h-40';

  if (value && !preview) {
    setPreview(value);
  }

  if (preview && !isUploading) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <ImagePreview
          url={preview}
          alt={label}
          type={type}
          onRemove={handleRemove}
          showCopy={uploadMode === 'url'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="mr-2 h-4 w-4" />
          Загрузить файл
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
        >
          <LinkIcon className="mr-2 h-4 w-4" />
          Вставить URL
        </Button>
      </div>

      {uploadMode === 'file' ? (
        <>
          <div
            className={`${uploadAreaSize} border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleButtonClick}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center px-4">
                  Перетащите изображение сюда или нажмите для выбора
                </p>
                <p className="text-xs text-muted-foreground">
                  Максимум {formatFileSize(limits.maxSize)}
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <X className="h-4 w-4" />
              {error}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="h-6 px-1"
              >
                <X className="h-3 w-3" />
              </Button>
            </p>
          )}
        </>
      ) : (
        <>
          <Input
            type="url"
            placeholder="https://example.com/image.png"
            value={value}
            onChange={handleUrlChange}
          />
          {error && (
            <p className="text-sm text-destructive flex items-center gap-2">
              <X className="h-4 w-4" />
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}