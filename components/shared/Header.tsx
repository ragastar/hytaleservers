'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

// Компонент навигационной ссылки с индикатором активности
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="relative group">
      <Button
        variant="ghost"
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          "hover:bg-transparent hover:text-purple-600 dark:hover:text-purple-400",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:to-cyan-500/10",
          "before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100",
          isActive && "text-purple-600 dark:text-purple-400"
        )}
      >
        {children}
      </Button>
      {/* Градиентная подсветка снизу */}
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full",
          "transition-all duration-300 ease-out",
          isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}

export function Header() {
  const { user, loading, initializeAuth, signOut } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300",
        isScrolled
          ? "border-zinc-200/80 bg-white/90 shadow-lg shadow-purple-500/5 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:shadow-purple-500/10 py-2"
          : "border-zinc-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-900/80 py-4"
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 transition-all duration-300",
                "group-hover:shadow-lg group-hover:shadow-purple-500/30 group-hover:scale-105",
                isScrolled ? "h-8 w-8" : "h-10 w-10"
              )}
            >
              <span className={cn("transition-all duration-300", isScrolled ? "text-base" : "text-xl")}>🎮</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <h1
                className={cn(
                  "font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 bg-clip-text text-transparent",
                  "dark:from-purple-400 dark:via-purple-300 dark:to-cyan-400",
                  "transition-all duration-300 bg-[length:200%_auto] group-hover:bg-right",
                  isScrolled ? "text-lg" : "text-xl"
                )}
                style={{ backgroundSize: '200% auto' }}
              >
                HytaleServers.tech
              </h1>
              <Flame className={cn(
                "text-orange-500 transition-all duration-300",
                "group-hover:text-orange-400 group-hover:animate-pulse",
                isScrolled ? "h-3.5 w-3.5" : "h-4 w-4"
              )} />
            </div>
          </Link>

          <nav className="flex items-center gap-2 md:gap-4">
            <NavLink href="/">Серверы</NavLink>
            <NavLink href="/about">О проекте</NavLink>

            <ThemeToggle />

            {!loading && user ? (
              <>
                <NavLink href="/profile">Профиль</NavLink>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className={cn(
                    "transition-all duration-300",
                    "hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-600",
                    "dark:hover:border-purple-400/50 dark:hover:bg-purple-400/10 dark:hover:text-purple-400"
                  )}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <NavLink href="/login">Войти</NavLink>
                <Link href="/add-server">
                  <Button
                    className={cn(
                      "relative overflow-hidden",
                      "bg-gradient-to-r from-purple-500 via-purple-600 to-cyan-500",
                      "bg-[length:200%_auto] transition-all duration-500",
                      "hover:bg-right hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105",
                      "active:scale-95"
                    )}
                    style={{ backgroundSize: '200% auto', backgroundPosition: 'left center' }}
                  >
                    Добавить сервер
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

