'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, CheckCircle, XCircle, Server, Globe, Users, Search, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Server {
  id: string;
  name: string;
  slug: string;
  ip: string;
  port: number;
  short_description: string;
  status: string;
  total_votes: number;
  rating: number;
  created_at: string;
}

interface ApiResponse {
  data: Server[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      } else {
        params.append('status', 'all');
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/servers?${params.toString()}`);
      const data: ApiResponse = await response.json();

      setServers(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, [page, statusFilter, searchQuery]);

  const getStats = () => {
    const pending = servers.filter(s => s.status === 'pending').length;
    const approved = servers.filter(s => s.status === 'approved').length;
    const rejected = servers.filter(s => s.status === 'rejected').length;
    return { pending, approved, rejected, total };
  };

  const stats = getStats();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'На модерации', className: 'bg-yellow-100 text-yellow-800' },
      approved: { label: 'Одобрено', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Отклонено', className: 'bg-red-100 text-red-800' },
      offline: { label: 'Оффлайн', className: 'bg-gray-100 text-gray-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
            Админ-панель
          </h1>
          <p className="text-muted-foreground">
            Модерация и управление серверами
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего серверов</CardDescription>
            <CardTitle className="text-3xl">{total}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              На модерации
            </CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Одобрено
            </CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Отклонено
            </CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                <Input
                  placeholder="Поиск по названию..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Фильтр по статусу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">На модерации</SelectItem>
                  <SelectItem value="approved">Одобрено</SelectItem>
                  <SelectItem value="rejected">Отклонено</SelectItem>
                  <SelectItem value="offline">Оффлайн</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={fetchServers}
                variant="outline"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Обновить'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Список серверов</CardTitle>
            <CardDescription>
              {total > 0 ? `Показано ${servers.length} из ${total}` : 'Нет серверов'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-500" />
              </div>
            ) : servers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Server className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Нет серверов для отображения
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {servers.map((server) => (
                  <div
                    key={server.id}
                    className="flex items-start justify-between rounded-lg border bg-card p-4"
                  >
                    <div className="flex flex-1 gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">
                            {server.name}
                          </h3>
                          {getStatusBadge(server.status)}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {server.ip}:{server.port}
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {server.total_votes} голосов
                          </div>

                          <div className="flex items-center gap-1">
                            ⭐ {server.rating || 0}/5.0
                          </div>
                        </div>

                        <div className="ml-4">
                          <Link href={`/admin/moderation/${server.id}`}>
                            <Button variant="outline" size="sm">
                              Подробнее
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-sm text-foreground">
                      {server.short_description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
