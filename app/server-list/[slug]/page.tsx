'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, ThumbsUp, ExternalLink, MessageCircle, Star, Copy, Check, Server, Shield, Calendar } from 'lucide-react';

interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string;
}

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopyIP = async () => {
    const fullAddress = `${server.ip}:${server.port}`;
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 animate-spin">
              <Server className="h-12 w-12 animate-spin-slow text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Загрузка сервера...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!server) {
    return null;
  }

  const isOnline = server.status === 'approved' && (server.online_players > 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          ← Назад к списку
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardContent className="p-0">
              {server.banner_url ? (
                <div className="relative h-[250px] w-full overflow-hidden">
                  <img
                    src={server.banner_url}
                    alt={`${server.name} banner`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              ) : (
                <div className="flex h-[250px] w-full items-center justify-center bg-muted">
                  <div className="text-6xl">🖼️</div>
                  <p className="mt-2 text-muted-foreground">Нет баннера</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-start gap-4">
                {server.logo_url && (
                  <img
                    src={server.logo_url}
                    alt={server.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground">
                    {server.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1.5">
                      {isOnline ? '🟢 Онлайн' : '🔴 Оффлайн'}
                    </Badge>
                    {server.categories?.map((category: Category) => (
                      <Badge key={category.id} variant="secondary" className="gap-1.5">
                        {category.icon && <span className="text-sm">{category.icon}</span>}
                        <span>{category.name}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Users className="mb-2 h-8 w-8 text-primary" />
                <p className="text-sm text-muted-foreground">Онлайн</p>
                <p className="text-2xl font-bold text-foreground">
                  {server.online_players || 0}/{server.max_players || 100}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <ThumbsUp className="mb-2 h-8 w-8 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Голоса</p>
                <p className="text-2xl font-bold text-foreground">
                  {server.total_votes || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Clock className="mb-2 h-8 w-8 text-blue-500" />
                <p className="text-sm text-muted-foreground">Аптайм</p>
                <p className="text-2xl font-bold text-foreground">
                  {server.uptime_percentage?.toFixed(1) || 0}%
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line leading-relaxed text-foreground">
                {server.full_description || server.short_description}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Подключение
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  IP Адрес сервера
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${server.ip}:${server.port}`}
                    readOnly
                    className="flex-1 rounded-md border border-input bg-muted px-4 py-3 text-sm"
                  />
                  <Button
                    onClick={handleCopyIP}
                    variant={copied ? "default" : "outline"}
                    className="min-w-[100px]"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Скопировано
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Копировать
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {server.discord_url && (
                  <Button variant="outline" asChild className="w-full justify-start">
                    <a href={server.discord_url} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Discord сервер
                    </a>
                  </Button>
                )}

                {server.website_url && (
                  <Button variant="outline" asChild className="w-full justify-start">
                    <a href={server.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Сайт сервера
                    </a>
                  </Button>
                )}

                <Button className="w-full justify-start">
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  Голосовать за сервер
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Рейтинг</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <span className="text-sm text-muted-foreground">Общий рейтинг</span>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-foreground">
                    {server.rating || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Количество голосов</span>
                <span className="text-sm font-medium text-foreground">
                  {server.total_votes || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Статус</span>
                <Badge variant={isOnline ? 'default' : 'destructive'}>
                  {isOnline ? 'Онлайн' : 'Оффлайн'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-muted-foreground">Статус сервера</span>
                <Badge variant={server.status === 'approved' ? 'default' : 'destructive'}>
                  {server.status === 'approved' ? 'Одобрен' : server.status}
                </Badge>
              </div>

              {server.created_at && (
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm text-muted-foreground">Добавлен</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(server.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {server.last_ping_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Последний пинг</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(server.last_ping_at).toLocaleString('ru-RU')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
