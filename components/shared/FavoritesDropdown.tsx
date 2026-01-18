'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Server, Users, ChevronRight } from 'lucide-react';
import { useFavoritesStore } from '@/lib/store/favoritesStore';

export function FavoritesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { favorites, loading, fetchFavorites } = useFavoritesStore();
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToServer = (slug: string) => {
    setIsOpen(false);
    router.push(`/server/${slug}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Избранное"
      >
        <Heart className="h-5 w-5" />
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {favorites.length > 9 ? '9+' : favorites.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="font-semibold text-sm">Избранные серверы</h3>
          </div>

          {loading ? (
            <div className="p-4 text-center text-sm text-zinc-500">
              Загрузка...
            </div>
          ) : favorites.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto">
              {favorites.map((server) => (
                <button
                  key={server.id}
                  onClick={() => navigateToServer(server.slug)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {server.logo_url ? (
                    <img
                      src={server.logo_url}
                      alt={server.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Server className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-medium text-sm truncate">{server.name}</div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Users className="w-3 h-3" />
                      <span>{server.current_players}/{server.max_players}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          server.status === 'approved' ? 'bg-green-500' : 'bg-zinc-400'
                        }`}
                      />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Heart className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-500">
                У вас пока нет избранных серверов
              </p>
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/');
                }}
                className="mt-2"
              >
                Перейти к серверам
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
