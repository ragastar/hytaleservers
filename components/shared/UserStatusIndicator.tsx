'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { usePresenceStore } from '@/lib/store/presenceStore';

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-zinc-400',
};

const statusLabels = {
  online: 'Онлайн',
  away: 'Отошёл',
  offline: 'Офлайн',
};

export function UserStatusIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuthStore();
  const { status, initPresence, updatePresence, startHeartbeat } = usePresenceStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      initPresence();
      const cleanup = startHeartbeat();
      return cleanup;
    }
  }, [user, initPresence, startHeartbeat]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await updatePresence('offline');
    await signOut();
    setIsOpen(false);
    router.push('/');
  };

  if (!user) return null;

  const userEmail = user.email || '';
  const userName = userEmail.split('@')[0];
  const avatarLetter = userName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2"
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm">
            {avatarLetter}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${statusColors[status]}`}
          />
        </div>
        <span className="hidden md:block text-sm max-w-[100px] truncate">
          {userName}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">
          {/* User info */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                  {avatarLetter}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${statusColors[status]}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{userName}</div>
                <div className="text-xs text-zinc-500 truncate">{userEmail}</div>
              </div>
            </div>
          </div>

          {/* Status selector */}
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
            <div className="text-xs text-zinc-500 px-2 py-1">Статус</div>
            {(['online', 'away', 'offline'] as const).map((s) => (
              <button
                key={s}
                onClick={() => updatePresence(s)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  status === s ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${statusColors[s]}`} />
                {statusLabels[s]}
              </button>
            ))}
          </div>

          {/* Menu items */}
          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile');
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <User className="w-4 h-4" />
              Профиль
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/profile/settings');
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Settings className="w-4 h-4" />
              Настройки
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
