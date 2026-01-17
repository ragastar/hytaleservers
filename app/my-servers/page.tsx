'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/authStore';
import { Plus, Loader2 } from 'lucide-react';

interface ServerData {
  id: string;
  name: string;
  slug: string;
  ip: string;
  port: number;
  status: string;
  short_description: string;
  current_players: number;
  max_players: number;
  total_votes: number;
  created_at: string;
  categories?: any[];
}

export default function MyServersPage() {
  const router = useRouter();
  const { user, serverLimit, serversUsed, fetchUserStats, signOut } = useAuthStore();
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchServers();
    }
  }, [user]);

  const fetchServers = async () => {
    try {
      const response = await fetch('/api/my-servers');
      if (response.ok) {
        const data = await response.json();
        setServers(data.servers || []);
      }
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
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
        await fetchUserStats();
      }
    } catch (error) {
      console.error('Failed to delete server:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
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
              <h1 className="mb-2 text-3xl font-bold text-foreground">
                Мои серверы
              </h1>
              <p className="text-muted-foreground">
                Управляйте своими серверами ({serversUsed} / {serverLimit})
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/profile')}
                variant="outline"
              >
                Профиль
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Выйти
              </Button>
              <Button
                onClick={() => router.push('/add-server')}
                disabled={serversUsed >= serverLimit}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Добавить сервер
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : servers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plus className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium text-foreground">
                  У вас пока нет серверов
                </h3>
                <p className="mb-4 text-muted-foreground">
                  Добавьте свой первый сервер!
                </p>
                <Button
                  onClick={() => router.push('/add-server')}
                  disabled={serversUsed >= serverLimit}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить сервер
                </Button>
              </CardContent>
            </Card>
          ) : (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {servers.map((server) => (
                 <Card key={server.id} className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10">
                   <CardContent className="p-6">
                     <div className="mb-3 flex items-start justify-between">
                       <div className="flex-1">
                         <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                           {server.name}
                         </h3>
                         <p className="text-sm text-muted-foreground">
                           {server.ip}:{server.port}
                         </p>
                       </div>
                       {getStatusBadge(server.status)}
                     </div>

                     <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                       {server.short_description}
                     </p>

                    {server.categories && server.categories.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {server.categories.slice(0, 3).map((category: any) => (
                          <Badge key={category.id} variant="secondary" className="text-xs">
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}

                     <div className="mb-4 flex items-center justify-between text-sm">
                       <span className="text-muted-foreground">
                         {server.current_players} / {server.max_players} онлайн
                       </span>
                       <span className="text-muted-foreground">
                         {server.total_votes} голосов
                       </span>
                     </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/server-list/${server.slug}`)}
                      >
                        Подробно
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
    </ProtectedRoute>
  );
}
