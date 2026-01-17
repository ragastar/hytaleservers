'use client';

import { useState, useEffect } from 'react';
import { ServerGrid } from "@/components/server/ServerGrid";
import { SearchBar } from "@/components/shared/SearchBar";

export default function SimpleHome() {
  const [servers, setServers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/servers')
      .then(res => res.json())
      .then(data => {
        console.log('Серверы:', data);
        setServers(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка:', err);
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
