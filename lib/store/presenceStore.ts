import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

type PresenceStatus = 'online' | 'away' | 'offline';

interface PresenceState {
  status: PresenceStatus;
  lastSeen: string | null;
  updatePresence: (status: PresenceStatus) => Promise<void>;
  initPresence: () => Promise<void>;
  startHeartbeat: () => () => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  status: 'offline',
  lastSeen: null,

  initPresence: async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Create or update presence record
    await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        status: 'online',
        last_seen: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    set({ status: 'online', lastSeen: new Date().toISOString() });
  },

  updatePresence: async (status: PresenceStatus) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_presence')
      .update({ status })
      .eq('user_id', user.id);

    set({ status, lastSeen: new Date().toISOString() });
  },

  startHeartbeat: () => {
    const interval = setInterval(() => {
      get().updatePresence('online');
    }, 30000); // Update every 30 seconds

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        get().updatePresence('away');
      } else {
        get().updatePresence('online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle before unload
    const handleBeforeUnload = () => {
      get().updatePresence('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  },
}));
