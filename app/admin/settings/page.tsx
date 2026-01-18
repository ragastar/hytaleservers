'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SettingsCard } from '@/components/admin/SettingsCard';
import { SettingField } from '@/components/admin/SettingField';
import { HistoryModal } from '@/components/admin/HistoryModal';
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';
import { toast } from 'sonner';
import {
  Home,
  Settings as SettingsIcon,
  FileText,
  Share2,
  Search,
  BarChart,
  ToggleLeft,
  AlertTriangle,
  Loader2,
  Save,
  RefreshCw
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, loading, error } = useSiteSettings();
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [historyModal, setHistoryModal] = useState<{ open: boolean; setting?: any }>({ open: false });

  useEffect(() => {
    if (!loading && !error) {
      setLocalSettings(settings);
    }
  }, [settings, loading, error]);

  const CATEGORIES = {
    home: {
      title: 'Главная страница',
      icon: <Home className="h-5 w-5" />,
      keys: ['home_banner_enabled', 'home_banner_url']
    },
    general: {
      title: 'Общие настройки',
      icon: <SettingsIcon className="h-5 w-5" />,
      keys: ['site_name', 'site_tagline', 'site_logo_url', 'site_favicon_url']
    },
    pages: {
      title: 'Страницы',
      icon: <FileText className="h-5 w-5" />,
      keys: ['about_page_image', 'about_page_content', 'privacy_page_content', 'terms_page_content']
    },
    socials: {
      title: 'Социальные сети',
      icon: <Share2 className="h-5 w-5" />,
      keys: ['social_telegram', 'social_discord', 'contact_email', 'contact_youtube', 'contact_vk']
    },
    seo: {
      title: 'SEO',
      icon: <Search className="h-5 w-5" />,
      keys: ['seo_title', 'seo_description', 'seo_keywords']
    },
    analytics: {
      title: 'Аналитика',
      icon: <BarChart className="h-5 w-5" />,
      keys: ['analytics_ga_id', 'analytics_ym_id']
    },
    features: {
      title: 'Функционал',
      icon: <ToggleLeft className="h-5 w-5" />,
      keys: ['feature_registration_enabled', 'feature_voting_enabled', 'feature_server_submission_enabled']
    },
    system: {
      title: 'Служебные',
      icon: <AlertTriangle className="h-5 w-5" />,
      keys: ['maintenance_mode', 'maintenance_message', 'beta_mode']
    }
  };

  const handleSave = async (key: string) => {
    setSaving(prev => ({ ...prev, [key]: true }));

    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: localSettings[key as keyof typeof localSettings]
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Настройка обновлена');
      } else {
        toast.error(data.error || 'Ошибка сохранения');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Ошибка сохранения');
    } finally {
      setSaving(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleUpload = async (file: File, key: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('key', key);

    const response = await fetch('/api/admin/settings/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка загрузки');
    }

    setLocalSettings(prev => ({
      ...prev,
      [key]: data.url
    }));

    await handleSave(key);

    return data.url;
  };

  const handleRollback = async (key: string, version: number) => {
    const response = await fetch(`/api/admin/settings/rollback/${key}/${version}`, {
      method: 'POST'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ошибка отката');
    }

    setLocalSettings(prev => ({
      ...prev,
      [key]: data.setting.value
    }));

    setHistoryModal({ open: false });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center py-12 text-center">
          <div>
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p className="text-xl font-semibold mb-2">Ошибка загрузки настроек</p>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Обновить страницу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
          Настройки сайта
        </h1>
        <p className="text-muted-foreground">
          Управление контентом и настройками через админку
        </p>
      </div>

      {Object.entries(CATEGORIES).map(([category, config]) => (
        <SettingsCard key={category} category={category} {...config}>
          <div className="space-y-4">
            {config.keys.map(key => (
              <div key={key} className="space-y-2">
                <SettingField
                  setting={{
                    id: '',
                    key,
                    value: localSettings[key as keyof typeof localSettings],
                    type: getKeyType(key),
                    category,
                    label: getSettingLabel(key),
                    description: getSettingDescription(key),
                    history: [],
                    current_version: 1,
                    updated_at: new Date().toISOString(),
                    updated_by: null,
                    created_at: new Date().toISOString()
                  }}
                  value={localSettings[key as keyof typeof localSettings]}
                  onChange={(value) => setLocalSettings(prev => ({ ...prev, [key]: value }))}
                  onUpload={(file) => handleUpload(file, key)}
                  onShowHistory={() => setHistoryModal({
                    open: true,
                    setting: {
                      id: '',
                      key,
                      value: localSettings[key as keyof typeof localSettings],
                      type: getKeyType(key),
                      category,
                      label: getSettingLabel(key),
                      description: getSettingDescription(key),
                      history: [],
                      current_version: 1,
                      updated_at: new Date().toISOString(),
                      updated_by: null,
                      created_at: new Date().toISOString()
                    }
                  })}
                />
                <Button
                  onClick={() => handleSave(key)}
                  disabled={saving[key]}
                  size="sm"
                  variant="outline"
                  className="mt-2"
                >
                  {saving[key] ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <Save className="h-4 w-4 mr-1" />
                  )}
                  Сохранить
                </Button>
              </div>
            ))}
          </div>
        </SettingsCard>
      ))}

      {historyModal.open && historyModal.setting && (
        <HistoryModal
          open={historyModal.open}
          onClose={() => setHistoryModal({ open: false })}
          setting={historyModal.setting}
          onRollback={(version) => handleRollback(historyModal.setting!.key, version)}
        />
      )}
    </div>
  );
}

function getKeyType(key: string): string {
  if (key.includes('enabled') || key.includes('mode')) {
    return 'boolean';
  }
  if (key.includes('url') || key.includes('image') || key.includes('logo') || key.includes('favicon')) {
    return 'image';
  }
  if (key.includes('id') && (key.includes('ga_') || key.includes('ym_'))) {
    return 'text';
  }
  if (key.includes('content') || key.includes('description') || key.includes('message') || key.includes('tagline')) {
    return 'text';
  }
  return 'text';
}

function getSettingLabel(key: string): string {
  const labels: Record<string, string> = {
    home_banner_enabled: 'Показать баннер на главной',
    home_banner_url: 'Баннер главной страницы',
    site_name: 'Название сайта',
    site_tagline: 'Слоган сайта',
    site_logo_url: 'Логотип сайта',
    site_favicon_url: 'Favicon сайта',
    about_page_image: 'Картинка страницы "О проекте"',
    about_page_content: 'Содержимое страницы "О проекте"',
    privacy_page_content: 'Политика конфиденциальности',
    terms_page_content: 'Условия использования',
    social_telegram: 'Telegram',
    social_discord: 'Discord',
    contact_email: 'Email для контактов',
    contact_youtube: 'YouTube',
    contact_vk: 'VK',
    seo_title: 'SEO заголовок',
    seo_description: 'SEO описание',
    seo_keywords: 'SEO ключевые слова',
    analytics_ga_id: 'Google Analytics ID',
    analytics_ym_id: 'Яндекс Метрика ID',
    feature_registration_enabled: 'Включить регистрацию',
    feature_voting_enabled: 'Включить голосование',
    feature_server_submission_enabled: 'Включить добавление серверов',
    maintenance_mode: 'Режим обслуживания',
    maintenance_message: 'Сообщение о обслуживании',
    beta_mode: 'Beta режим'
  };

  return labels[key] || key;
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    home_banner_enabled: 'Включение/выключение баннера на главной странице',
    home_banner_url: 'Картинка-баннер на главной странице (1200x400px)',
    site_name: 'Название которое отображается в заголовке',
    site_tagline: 'Короткое описание сайта',
    site_logo_url: 'Логотип для сайта и favicon (512x512px)',
    site_favicon_url: 'Иконка сайта во вкладке браузера (64x64px)',
    about_page_image: 'Картинка-баннер для страницы О проекте',
    about_page_content: 'Текст для страницы О проекте',
    privacy_page_content: 'Политика конфиденциальности',
    terms_page_content: 'Условия использования сайта',
    social_telegram: 'Ссылка на Telegram канал',
    social_discord: 'Ссылка на Discord сервер',
    contact_email: 'Email для связи',
    contact_youtube: 'Ссылка на YouTube канал',
    contact_vk: 'Ссылка на группу VK',
    seo_title: 'Заголовок для SEO (title tag)',
    seo_description: 'Описание для SEO (meta description)',
    seo_keywords: 'Ключевые слова через запятую',
    analytics_ga_id: 'Google Analytics 4 Measurement ID (G-XXXXXXXXXX)',
    analytics_ym_id: 'ID Яндекс Метрики (XXXXXXXXXX)',
    feature_registration_enabled: 'Позволяет пользователям регистрироваться',
    feature_voting_enabled: 'Позволяет голосовать за серверы',
    feature_server_submission_enabled: 'Позволяет пользователям добавлять свои серверы',
    maintenance_mode: 'Включает режим обслуживания для всех пользователей',
    maintenance_message: 'Сообщение которое показывается в режиме обслуживания',
    beta_mode: 'Показывает badge что сайт в beta тестировании'
  };

  return descriptions[key] || '';
}
