'use client';

import { useState, useEffect } from 'react';
import { SiteSettings, DEFAULT_SETTINGS } from '@/lib/settings';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/admin/settings');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load settings');
        }

        const mapped: Partial<SiteSettings> = {};

        data.settings?.forEach((setting: any) => {
          mapped[setting.key as keyof SiteSettings] = setting.value;
        });

        setSettings({ ...DEFAULT_SETTINGS, ...mapped });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки настроек';
        setError(errorMessage);
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, loading, error };
}
