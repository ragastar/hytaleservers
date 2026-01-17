import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserStats {
  totalServers: number;
  totalOnline: number;
  totalVotes: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  userStats: UserStats | null;
  serverLimit: number;
  serversUsed: number;

  // Методы
  initializeAuth: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUserStats: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  userStats: null,
  serverLimit: 3,
  serversUsed: 0,

  initializeAuth: async () => {
    console.log('AuthStore: initializeAuth called');
    const supabase = createClient();
    
    // Получить текущую сессию
    const { data: { session } } = await supabase.auth.getSession();
    console.log('AuthStore: Current session:', { hasSession: !!session, userId: session?.user?.id });
    set({ user: session?.user || null, loading: false });

    // Загрузить статистику если пользователь авторизован
    if (session?.user) {
      get().fetchUserStats();
    }

    // Подписаться на изменения сессии
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthStore: Auth state changed:', { event: _event, hasSession: !!session, userId: session?.user?.id });
      set({ user: session?.user || null, loading: false });
      
      if (session?.user) {
        get().fetchUserStats();
      }
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Загрузить статистику пользователя
    get().fetchUserStats();
  },

  signUpWithEmail: async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Создать запись в user_server_limits с лимитом 3
    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from('user_server_limits').insert({
          user_id: data.user.id,
          max_servers: 3,
          is_paid: false,
        });
      }
    }

    // Загрузить статистику
    get().fetchUserStats();
  },

  signOut: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ 
      user: null, 
      userStats: null, 
      serverLimit: 3, 
      serversUsed: 0 
    });
  },

  fetchUserStats: async () => {
    const { user } = get();
    if (!user) return;

    const supabase = createClient();

    // Получить статистику серверов
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('owner_id', user.id)
      .single();

    // Получить лимит серверов
    const { data: limitData } = await supabase
      .from('user_server_limits')
      .select('max_servers')
      .eq('user_id', user.id)
      .single();

    if (!stats && !limitData) return;

    set({
      userStats: {
        totalServers: stats?.total_servers || 0,
        totalOnline: stats?.total_online || 0,
        totalVotes: stats?.total_votes || 0,
      },
      serverLimit: limitData?.max_servers || 3,
      serversUsed: stats?.total_servers || 0,
    });
  },
}));
