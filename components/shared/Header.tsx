'use client';

import { useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderSearch } from "@/components/shared/HeaderSearch";
import { FavoritesDropdown } from "@/components/shared/FavoritesDropdown";
import { MessagesDropdown } from "@/components/shared/MessagesDropdown";
import { UserStatusIndicator } from "@/components/shared/UserStatusIndicator";
import { Flame } from "lucide-react";

export function Header() {
  const { user, loading, initializeAuth } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <span className="text-xl">🎮</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                HytaleServers.tech
              </h1>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </Link>

          {/* Search (center) */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <HeaderSearch />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">Серверы</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">О проекте</Button>
            </Link>

            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700 mx-1" />

            <ThemeToggle />

            {!loading && user ? (
              <>
                <FavoritesDropdown />
                <MessagesDropdown />
                <UserStatusIndicator />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Войти</Button>
                </Link>
                <Link href="/add-server">
                  <Button size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    Добавить сервер
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-3">
          <HeaderSearch />
        </div>
      </div>
    </header>
  );
}
