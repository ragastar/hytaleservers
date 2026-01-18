'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { ServerGrid } from "@/components/server/ServerGrid";
import { useSiteSettings } from '@/lib/hooks/useSiteSettings';

export default function Home() {
  const { theme } = useTheme();
  const { settings } = useSiteSettings();
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetch('/api/servers')
      .then(res => res.json())
      .then(data => {
        setServers(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {settings.home_banner_enabled && settings.home_banner_url && (
        <div className="mb-8 max-w-4xl mx-auto">
          <img
            src={settings.home_banner_url}
            alt="Hytale Banner"
            className="w-full h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/1200x400/6366f1/white?text=Hytale+Servers';
            }}
          />
        </div>
      )}

      <h1 className="mb-4 text-3xl font-bold text-foreground">
        Топ серверов
      </h1>
      <p className="mb-8 text-muted-foreground">
        Найдено {servers.length} серверов
      </p>
      <ServerGrid servers={servers} />
    </div>
  );
}
