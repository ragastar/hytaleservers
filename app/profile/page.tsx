'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Users, ThumbsUp, Server, Mail, Calendar } from 'lucide-react';

interface ServerData {
  id: string;
  name: string;
  slug: string;
  status: string;
  current_players: number;
  max_players: number;
  total_votes: number;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, userStats, serverLimit, serversUsed, signOut, initializeAuth } = useAuthStore();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      console.log('ProfilePage: Initializing auth...');
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    console.log('ProfilePage: User changed:', { user, loading });
    if (user) {
      fetchUserServers();
    }
  }, [user]);

  const fetchUserServers = async () => {
    try {
      console.log('ProfilePage: Fetching user servers...');
      const response = await fetch('/api/my-servers');
      if (response.ok) {
        const data = await response.json();
        console.log('ProfilePage: Fetched servers:', data);
        setServers(data.servers || []);
      }
    } catch (error) {
      console.error('ProfilePage: Failed to fetch user servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDeleteServer = async (serverId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот сервер?')) {
      return;
    }

    try {
      const response = await fetch(`/api/servers/${serverId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServers(prev => prev.filter(s => s.id !== serverId));
        await useAuthStore.getState().fetchUserStats();
      }
    } catch (error) {
      console.error('ProfilePage: Failed to delete server:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">Одобрен</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700">На модерации</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">Отклонён</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
      <ProtectedRoute>
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Профиль пользователя
              </h1>
              <p className="mt-1 text-muted-foreground">
                Управляйте своими серверами
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/my-servers')}
              >
                Мои серверы
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Выйти
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{user?.email}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Дата регистрации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Н/Д'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Лимит серверов
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  {serversUsed} / {serverLimit}
                </p>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{ width: `${(serversUsed / serverLimit) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Общий онлайн
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {userStats?.totalOnline || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5" />
                  Голоса
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {userStats?.totalVotes || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                Мои серверы
              </h2>
              <Button
                onClick={() => router.push('/add-server')}
                disabled={serversUsed >= serverLimit}
              >
                Добавить сервер
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : servers.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Server className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium text-foreground">
                    У вас пока нет серверов
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Добавьте свой первый сервер!
                  </p>
                  <Button onClick={() => router.push('/add-server')}>
                    Добавить сервер
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {servers.map((server) => (
                  <Card key={server.id}>
                     <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-foreground">
                            {server.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {server.current_players} / {server.max_players} онлайн
                          </p>
                        </div>
                        {getStatusBadge(server.status)}
                      </div>
                      <div className="mb-3 flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Голоса: {server.total_votes}
                        </span>
                        <span className="text-muted-foreground">
                          Добавлен: {new Date(server.created_at).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/server-list/${server.slug}`)}
                        >
                          Подробнее
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteServer(server.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
    </ProtectedRoute>
  );
}
