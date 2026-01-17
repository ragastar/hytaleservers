'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { Check, Loader2 } from 'lucide-react';

const AVAILABLE_CATEGORIES = [
  { name: 'Выживание', slug: 'survival', icon: '⛏️' },
  { name: 'PvP', slug: 'pvp', icon: '⚔️' },
  { name: 'PvE', slug: 'pve', icon: '🛡️' },
  { name: 'RPG', slug: 'rpg', icon: '🎭' },
  { name: 'Творчество', slug: 'creative', icon: '🎨' },
  { name: 'Мини-игры', slug: 'minigames', icon: '🎮' },
  { name: 'Анархия', slug: 'anarchy', icon: '💀' },
  { name: 'Экономика', slug: 'economy', icon: '💰' },
  { name: 'SkyBlock', slug: 'skyblock', icon: '🏝️' },
  { name: 'Фракции', slug: 'factions', icon: '🏰' },
  { name: 'Хардкор', slug: 'hardcore', icon: '💪' },
  { name: 'Ванилла', slug: 'vanilla', icon: '🌿' },
  { name: 'Моддед', slug: 'modded', icon: '🔧' }
];

export default function AddServerPage() {
  const router = useRouter();
  const { user, loading: authLoading, initializeAuth, serverLimit, serversUsed } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    port: '25565',
    short_description: '',
    full_description: '',
    logo_url: '',
    banner_url: '',
    website_url: '',
    discord_url: ''
  });

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(slug)) {
        return prev.filter(c => c !== slug);
      }
      if (prev.length < 3) {
        return [...prev, slug];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (serversUsed >= serverLimit) {
      setError(`Вы достигли лимита серверов (${serverLimit}).`);
      setLoading(false);
      return;
    }

    if (!formData.name || !formData.ip) {
      setError('Пожалуйста, заполните обязательные поля');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categories: selectedCategories
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit server');
      }

      setSuccess(true);
      await useAuthStore.getState().fetchUserStats();
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при отправке');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="mx-auto max-w-2xl">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Сервер отправлен на модерацию!
              </h2>
              <p className="text-muted-foreground">
                Ваш сервер будет проверен и добавлен на сайт в ближайшее время.
                Вы будете перенаправлены на главную страницу через 3 секунды.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
            Добавить сервер
          </h1>
          <p className="text-muted-foreground">
            Заполните информацию о сервере, чтобы добавить его в наш мониторинг
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Информация о сервере</CardTitle>
            <CardDescription>
              Все поля отмеченные * обязательны для заполнения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">
                  Название сервера *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Мой awesome сервер"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ip">
                    IP адрес *
                  </Label>
                  <Input
                    id="ip"
                    name="ip"
                    placeholder="play.example.com"
                    value={formData.ip}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">
                    Порт
                  </Label>
                  <Input
                    id="port"
                    name="port"
                    type="number"
                    placeholder="25565"
                    value={formData.port}
                    onChange={handleInputChange}
                    min={1}
                    max={65535}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">
                  Краткое описание * (максимум 160 символов)
                </Label>
                <Input
                  id="short_description"
                  name="short_description"
                  placeholder="Лучший сервер для игры с друзьями..."
                  value={formData.short_description}
                  onChange={handleInputChange}
                  required
                  maxLength={160}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_description">
                  Полное описание
                </Label>
                <Textarea
                  id="full_description"
                  name="full_description"
                  placeholder="Подробное описание вашего сервера, фичи, правила и т.д..."
                  value={formData.full_description}
                  onChange={handleInputChange}
                  rows={6}
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Категории (выберите до 3)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map(category => (
                    <Badge
                      key={category.slug}
                      variant={selectedCategories.includes(category.slug) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => toggleCategory(category.slug)}
                    >
                      {category.icon} {category.name}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Выбрано: {selectedCategories.length}/3
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ImageUploader
                  type="logo"
                  label="Логотип сервера"
                  value={formData.logo_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
                />
                <ImageUploader
                  type="banner"
                  label="Баннер сервера"
                  value={formData.banner_url}
                  onChange={(url) => setFormData(prev => ({ ...prev, banner_url: url }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website_url">
                    Ссылка на сайт
                  </Label>
                  <Input
                    id="website_url"
                    name="website_url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discord_url">
                    Ссылка на Discord
                  </Label>
                  <Input
                    id="discord_url"
                    name="discord_url"
                    type="url"
                    placeholder="https://discord.gg/..."
                    value={formData.discord_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  'Отправить на модерацию'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
