'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthFormProps {
  type: 'login' | 'register' | 'admin';
  onSubmit?: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (type === 'register') {
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Пароль должен быть минимум 6 символов');
        setLoading(false);
        return;
      }
    }

    try {
      if (onSubmit) {
        await onSubmit(email, password);
      } else if (type === 'admin') {
        // Admin login через API
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка входа');
        }

        router.push('/admin');
      } else if (type === 'login') {
        await signInWithEmail(email, password);
        router.push('/add-server');
      } else if (type === 'register') {
        await signUpWithEmail(email, password);
        router.push('/add-server');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'login':
        return 'Вход в систему';
      case 'register':
        return 'Регистрация';
      case 'admin':
        return 'Вход для админов';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'login':
        return 'Введите свои данные для входа';
      case 'register':
        return 'Создайте аккаунт для добавления серверов';
      case 'admin':
        return 'Введите админские данные';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'login':
        return 'Войти';
      case 'register':
        return 'Зарегистрироваться';
      case 'admin':
        return 'Войти в админку';
    }
  };

   return (
     <div className="flex items-center justify-center py-12 px-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{getTitle()}</CardTitle>
          <CardDescription className="text-center">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={type === 'register' ? 6 : undefined}
              />
            </div>

            {type === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                getButtonText()
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {type === 'login' && (
              <p className="text-muted-foreground">
                Нет аккаунта?{' '}
                <a href="/register" className="text-purple-600 hover:text-purple-700">
                  Зарегистрируйтесь
                </a>
              </p>
            )}
            {type === 'register' && (
              <p className="text-muted-foreground">
                Уже есть аккаунт?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-700">
                  Войдите
                </a>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
