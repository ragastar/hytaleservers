'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, Server, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  current_players: number;
  max_players: number;
  status: string;
}

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchServers = async () => {
      if (query.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from('servers')
        .select('id, name, slug, logo_url, current_players, max_players, status')
        .eq('status', 'approved')
        .ilike('name', `%${query}%`)
        .order('current_players', { ascending: false })
        .limit(5);

      setResults(data || []);
      setIsOpen(true);
      setLoading(false);
      setSelectedIndex(-1);
    };

    const debounce = setTimeout(searchServers, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Enter' && query.length >= 2) {
        router.push(`/?search=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          navigateToServer(results[selectedIndex].slug);
        } else {
          router.push(`/?search=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const navigateToServer = (slug: string) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/server/${slug}`);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Поиск серверов..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-48 pl-9 pr-3 h-9 text-sm bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 focus:w-64 transition-all"
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50 min-w-[280px]"
        >
          {loading ? (
            <div className="p-3 text-center text-sm text-zinc-500">
              Поиск...
            </div>
          ) : results.length > 0 ? (
            <>
              {results.map((server, index) => (
                <button
                  key={server.id}
                  onClick={() => navigateToServer(server.slug)}
                  className={`w-full flex items-center gap-3 p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                    index === selectedIndex ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                  }`}
                >
                  {server.logo_url ? (
                    <img
                      src={server.logo_url}
                      alt={server.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Server className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{server.name}</div>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Users className="w-3 h-3" />
                      <span>{server.current_players}/{server.max_players}</span>
                      <span
                        className={`ml-2 w-2 h-2 rounded-full ${
                          server.status === 'approved'
                            ? 'bg-green-500'
                            : 'bg-zinc-400'
                        }`}
                      />
                    </div>
                  </div>
                </button>
              ))}
              <button
                onClick={() => {
                  router.push(`/?search=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="w-full p-2 text-center text-sm text-purple-600 dark:text-purple-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700"
              >
                Показать все результаты
              </button>
            </>
          ) : (
            <div className="p-3 text-center text-sm text-zinc-500">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
