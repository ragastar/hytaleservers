'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, ThumbsUp, ExternalLink, MessageCircle } from 'lucide-react';

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const slug = params.slug;
        const response = await fetch(`/api/servers?slug=${slug}`);
        const data = await response.json();
        
        if (!response.ok) {
          router.push('/');
          return;
        }

        setServer(data.server);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching server:', error);
        router.push('/');
      }
    };

    fetchServer();
  }, [params, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!server) {
    return null;
  }

  const isOnline = server.status === 'approved';

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Назад
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-start gap-4">
                {server.logo_url && (
                  <img
                    src={server.logo_url}
                    alt={server.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {server.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={isOnline ? 'default' : 'destructive'}>
                      {isOnline ? '🟢 Онлайн' : '🔴 Оффлайн'}
                    </Badge>
                    {server.categories?.map((category: any) => (
                      <Badge key={category.id} variant="secondary">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  Онлайн
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {server.online_players || 0}/{server.max_players || 100}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  Голоса
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {server.total_votes || 0}
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Аптайм
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {server.uptime_percentage?.toFixed(1) || 0}%
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                Описание
              </h2>
              <p className="text-foreground whitespace-pre-line">
                {server.full_description || server.short_description}
              </p>
            </div>

            {server.banner_url && (
              <div className="mb-6">
                <img
                  src={server.banner_url}
                  alt={`${server.name} banner`}
                  className="w-full rounded-lg object-cover"
                />
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Подключение
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  IP Адрес
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${server.ip}:${server.port}`}
                    readOnly
                    className="flex-1 rounded-md border border-input bg-input px-3 py-2 text-sm text-foreground"
                  />
                  <Button
                    onClick={() => navigator.clipboard.writeText(`${server.ip}:${server.port}`)}
                    size="sm"
                  >
                    Копировать
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {server.discord_url && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={server.discord_url} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Discord
                    </a>
                  </Button>
                )}

                {server.website_url && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={server.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Сайт сервера
                    </a>
                  </Button>
                )}

                <Button className="w-full">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Голосовать
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Статистика
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Рейтинг</span>
                <span className="text-sm font-medium text-foreground">
                  ⭐ {server.rating || 0}/5.0
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Статус</span>
                <span className="text-sm font-medium text-foreground">
                  {server.status === 'approved' ? 'Одобрен' : server.status}
                </span>
              </div>

              {server.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Добавлен</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(server.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}

              {server.last_ping_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Последний пинг</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(server.last_ping_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
