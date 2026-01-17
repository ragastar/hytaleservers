'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, Clock, Globe, Server, MessageCircle, ExternalLink, Loader2 } from 'lucide-react';

export default function AdminModerationPage() {
  const params = useParams();
  const router = useRouter();
  const [server, setServer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/admin-moderation/${id}`);
        const data = await response.json();
        setServer(data);
      } catch (err) {
        setError('Не удалось загрузить сервер');
      } finally {
        setLoading(false);
      }
    };
    fetchServer();
  }, [params]);

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin-moderation/${server!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить статус');
      }

      setSuccess(`Статус сервера обновлен на: ${newStatus}`);
      setServer((prev: any) => prev ? { ...prev, status: newStatus } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-600 hover:bg-green-700">
            <Check className="mr-1 h-3 w-3" />
            Одобрено
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Отклонено
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Clock className="mr-1 h-3 w-3" />
            Модерация
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Назад
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-500" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-900">{error}</p>
        </div>
      ) : success ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-green-900">{success}</p>
        </div>
      ) : !server ? (
        <div className="flex items-center justify-center py-12">
          <Server className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">
            Сервер не найден
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="mb-3 text-2xl">{server.name}</CardTitle>
                <CardDescription className="text-sm">
                  {getStatusBadge(server.status)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">IP адрес</p>
                  <p className="text-sm text-muted-foreground">{server.ip}:{server.port}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Email владельца</p>
                  <p className="text-sm text-muted-foreground">{server.owner_email}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Краткое описание</p>
                  <p className="text-sm text-muted-foreground">{server.short_description}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Полное описание</p>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{server.full_description}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Категории</p>
                  <div className="flex flex-wrap gap-2">
                    {server.categories?.map((cat: any) => (
                      <Badge key={cat.id} variant="outline">
                        {cat.icon} {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={updating || server.status === 'approved'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Одобрить
                </Button>

                <Button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={updating || server.status === 'rejected'}
                  variant="destructive"
                  className="w-full"
                >
                  <X className="mr-2 h-4 w-4" />
                  Отклонить
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Подключение</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {server.website_url && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={server.website_url} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" />
                      Сайт сервера
                    </a>
                  </Button>
                )}

                {server.discord_url && (
                  <Button variant="outline" asChild className="w-full">
                    <a href={server.discord_url} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Discord
                    </a>
                  </Button>
                )}

                <Button variant="outline" asChild className="w-full">
                  <a href={`/server-list/${server.slug}`}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Страница сервера
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Рейтинг</p>
                  <p className="text-sm text-muted-foreground">
                    ⭐ {server.rating || 0}/5.0
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Голоса</p>
                  <p className="text-sm text-muted-foreground">
                    {server.total_votes} голосов
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">Создан</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(server.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
