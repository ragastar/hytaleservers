'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Settings,
  Check
} from 'lucide-react';
import { useMessagesStore } from '@/lib/store/messagesStore';

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  system: Settings,
};

const typeColors = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
  system: 'text-purple-500',
};

export function MessagesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { messages, unreadCount, loading, fetchMessages, markAsRead, markAllAsRead } = useMessagesStore();
  const router = useRouter();

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMessageClick = (messageId: string, link: string | null) => {
    markAsRead(messageId);
    if (link) {
      setIsOpen(false);
      router.push(link);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} мин. назад`;
    if (hours < 24) return `${hours} ч. назад`;
    if (days < 7) return `${days} дн. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Уведомления"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Уведомления</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                <Check className="w-3 h-3 mr-1" />
                Прочитать все
              </Button>
            )}
          </div>

          {loading ? (
            <div className="p-4 text-center text-sm text-zinc-500">
              Загрузка...
            </div>
          ) : messages.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto">
              {messages.map((message) => {
                const Icon = typeIcons[message.type];
                const colorClass = typeColors[message.type];

                return (
                  <button
                    key={message.id}
                    onClick={() => handleMessageClick(message.id, message.link)}
                    className={`w-full flex items-start gap-3 p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${
                      !message.is_read ? 'bg-purple-50 dark:bg-purple-950/20' : ''
                    }`}
                  >
                    <div className={`mt-0.5 ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {message.title}
                        </span>
                        {!message.is_read && (
                          <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5">
                        {message.content}
                      </p>
                      <span className="text-[10px] text-zinc-400 mt-1 block">
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Bell className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-600" />
              <p className="text-sm text-zinc-500">
                У вас нет уведомлений
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
