'use client';

import { useState } from 'react';
import { SiteSetting } from '@/lib/settings';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { toast } from 'sonner';
import { History, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingFieldProps {
  setting: SiteSetting;
  value: any;
  onChange: (value: any) => void;
  onUpload?: (file: File) => Promise<string>;
  onShowHistory?: () => void;
}

export function SettingField({ setting, value, onChange, onUpload, onShowHistory }: SettingFieldProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!onUpload) {
      toast.error('Upload function not provided');
      return '';
    }

    setUploading(true);
    try {
      const url = await onUpload(file);
      return url;
    } catch (error) {
      toast.error('Ошибка загрузки картинки');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const renderField = () => {
    switch (setting.type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value}
              onCheckedChange={onChange}
            />
            <Label>{value ? 'Включено' : 'Выключено'}</Label>
          </div>
        );

      case 'text':
        if (setting.key.includes('content') || setting.key.includes('description')) {
          return (
            <Textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              placeholder={setting.description || undefined}
            />
          );
        }
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.description || undefined}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.description || undefined}
          />
        );

      case 'image':
        if (uploading) {
          return (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загрузка...
            </div>
          );
        }
        return (
          <ImageUploader
            type="banner"
            label={setting.label || 'Изображение'}
            value={value}
            onChange={onChange}
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={setting.description || undefined}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={setting.key} className="text-base font-medium">
          {setting.label}
        </Label>
        {onShowHistory && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onShowHistory}
          >
            <History className="h-4 w-4 mr-1" />
            История
          </Button>
        )}
      </div>
      {renderField()}
      {setting.description && (
        <p className="text-sm text-muted-foreground">
          {setting.description}
        </p>
      )}
    </div>
  );
}
