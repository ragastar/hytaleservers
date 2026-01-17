'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, initializeAuth } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      const init = async () => {
        console.log('ProtectedRoute: Initializing auth...');
        await initializeAuth();
        console.log('ProtectedRoute: Auth initialized, user:', user);
        hasInitialized.current = true;
      };
      init();
    }
  }, []);

  useEffect(() => {
    console.log('ProtectedRoute: User state changed:', { user, loading });
    if (!loading && !user) {
      console.log('ProtectedRoute: No user, redirecting to /login');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute: No user, returning null');
    return null;
  }

  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
}
