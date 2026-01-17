'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Не перенаправлять, если мы на странице входа
    if (pathname === '/admin/login') {
      return;
    }

    // Проверить наличие админской сессии в cookies
    const hasAdminSession = document.cookie.includes('admin_session');
    
    if (!hasAdminSession) {
      router.push('/admin/login');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
