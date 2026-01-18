import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface Message {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  link: string | null;
  is_read: boolean;
  created_at: string;
}

interface MessagesState {
  messages: Message[];
  unreadCount: number;
  loading: boolean;
  fetchMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  unreadCount: 0,
  loading: false,

  fetchMessages: async () => {
    set({ loading: true });
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ messages: [], unreadCount: 0, loading: false });
      return;
    }

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const messages = (data as Message[]) || [];
    const unreadCount = messages.filter((m) => !m.is_read).length;

    set({ messages, unreadCount, loading: false });
  },

  markAsRead: async (messageId: string) => {
    const supabase = createClient();

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, is_read: true } : m
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    set((state) => ({
      messages: state.messages.map((m) => ({ ...m, is_read: true })),
      unreadCount: 0,
    }));
  },
}));
