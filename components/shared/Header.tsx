'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/authStore";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderSearch } from "@/components/shared/HeaderSearch";
import { FavoritesDropdown } from "@/components/shared/FavoritesDropdown";
import { MessagesDropdown } from "@/components/shared/MessagesDropdown";
import { UserStatusIndicator } from "@/components/shared/UserStatusIndicator";
import {
  Flame,
  Menu,
  Server,
  Info,
  User,
  LogOut,
  LogIn,
  Plus,
  Bell,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

// Navigation items with icons
const navItems = [
  { href: "/", label: "Серверы", icon: Server },
  { href: "/about", label: "О проекте", icon: Info },
];

export function Header() {
  const { user, loading, initializeAuth, signOut } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications] = useState(3); // Mock notification count

  useEffect(() => {
    const init = async () => {
      await initializeAuth();
    };
    init();
  }, [initializeAuth]);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  // Get avatar URL (using Gravatar or user metadata)
  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    return null;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <span className="text-lg sm:text-xl">🎮</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                HytaleServers.tech
              </h1>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <ThemeToggle />

            {!loading && user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {notifications > 9 ? '9+' : notifications}
                    </span>
                  )}
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={getAvatarUrl() || undefined} alt={user.email || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-2 p-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl() || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium truncate max-w-[160px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                        <User className="h-4 w-4" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-server" className="flex items-center gap-2 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Добавить сервер
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Войти
                  </Button>
                </Link>
                <Link href="/add-server">
                  <Button className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    <Plus className="h-4 w-4" />
                    Добавить сервер
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />

            {!loading && user && (
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Открыть меню</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                      <span className="text-base">🎮</span>
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
                      HytaleServers
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-4 mt-6">
                  {/* User Info (if logged in) */}
                  {!loading && user && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getAvatarUrl() || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {user.email}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          Авторизован
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-12"
                        >
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="h-px bg-zinc-200 dark:bg-zinc-700" />

                  {/* Auth Actions */}
                  {!loading && user ? (
                    <nav className="flex flex-col gap-1">
                      <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                          <User className="h-5 w-5" />
                          Профиль
                        </Button>
                      </Link>
                      <Link href="/add-server" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
                          <Plus className="h-5 w-5" />
                          Добавить сервер
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12 text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-5 w-5" />
                        Выйти
                      </Button>
                    </nav>
                  ) : (
                    <nav className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2 h-12">
                          <LogIn className="h-5 w-5" />
                          Войти
                        </Button>
                      </Link>
                      <Link href="/add-server" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gap-2 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                          <Plus className="h-5 w-5" />
                          Добавить сервер
                        </Button>
                      </Link>
                    </nav>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
