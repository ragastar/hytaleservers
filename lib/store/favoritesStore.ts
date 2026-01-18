import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface Server {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  current_players: number;
  max_players: number;
  status: string;
}

interface FavoritesState {
  favorites: Server[];
  loading: boolean;
  fetchFavorites: () => Promise<void>;
  addFavorite: (serverId: string) => Promise<void>;
  removeFavorite: (serverId: string) => Promise<void>;
  isFavorite: (serverId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async () => {
    set({ loading: true });
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ favorites: [], loading: false });
      return;
    }

    const { data } = await supabase
      .from('favorites')
      .select(`
        server_id,
        servers (
          id,
          name,
          slug,
          logo_url,
          current_players,
          max_players,
          status
        )
      `)
      .eq('user_id', user.id);

    interface FavoriteRow {
      server_id: string;
      servers: Server | Server[] | null;
    }

    const favorites = (data as FavoriteRow[] | null)
      ?.map((f) => {
        // Handle both single object and array cases from Supabase
        const server = Array.isArray(f.servers) ? f.servers[0] : f.servers;
        return server;
      })
      .filter((s): s is Server => s !== null && s !== undefined) || [];
    set({ favorites, loading: false });
  },

  addFavorite: async (serverId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('favorites').insert({
      user_id: user.id,
      server_id: serverId,
    });

    get().fetchFavorites();
  },

  removeFavorite: async (serverId: string) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('server_id', serverId);

    set((state) => ({
      favorites: state.favorites.filter((f) => f.id !== serverId),
    }));
  },

  isFavorite: (serverId: string) => {
    return get().favorites.some((f) => f.id === serverId);
  },
}));
