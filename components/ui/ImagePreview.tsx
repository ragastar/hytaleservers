'use client';

import { useState } from 'react';
import { X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ImagePreviewProps {
  url: string;
  alt: string;
  type: 'logo' | 'banner';
  onRemove: () => void;
  showCopy?: boolean;
}

export function ImagePreview({
  url,
  alt,
  type,
  onRemove,
  showCopy = false
}: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    toast.success('URL скопирован');
  };

  const previewSize = type === 'logo' ? 'w-32 h-32' : 'w-full h-40';

  if (imageError) {
    return (
      <div className={`${previewSize} flex items-center justify-center rounded-lg border border-dashed border-muted bg-muted/50`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Ошибка загрузки</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRemove}
            className="mt-2"
          >
            Удалить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`${previewSize} overflow-hidden rounded-lg border bg-muted`}>
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>

      <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        {showCopy && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopyUrl}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}