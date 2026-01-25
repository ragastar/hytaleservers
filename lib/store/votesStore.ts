import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

export interface VotesState {
  hasVotedToday: boolean;
  votesRemaining: number;
  serverVoteCounts: Map<string, number>;
  lastVoteTime: Date | null;
}

export interface ServerVote {
  serverId: string;
  hasVotedToday: boolean;
  voteCount: number;
}

interface VoteRecord {
  server_id: string;
  user_id?: string;
  voted_at: Date;
}

const INITIAL_STATE: VotesState = {
  hasVotedToday: false,
  votesRemaining: 0,
  serverVoteCounts: new Map(),
  lastVoteTime: null,
};

export const useVotesStore = create<VotesState>((set, get) => ({
  ...INITIAL_STATE,
  
  voteForServer: async (serverId: string, userIp?: string, userAgent?: string) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return { success: false, message: 'Не авторизован' };
    }
    
    const userId = user.id;
    const supabase = await createClient();
    
    // Проверка, голосовал ли сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingVote } = await supabase
      .from('votes')
      .select('*')
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .gte('voted_at', today.toISOString())
      .single();
    
    if (existingVote) {
      set({
        hasVotedToday: true,
        lastVoteTime: new Date(existingVote.voted_at),
      });
      
      return { 
        success: false, 
        message: 'Вы уже голосовали сегодня за этот сервер',
        serverVoteCount: get().serverVoteCounts.get(serverId) || 0
      };
    }
    
    // Добавление голоса
    const { data: vote, error } = await supabase
      .from('votes')
      .insert({
        server_id: serverId,
        user_id: userId,
        ip_address: userIp || null,
        user_agent: userAgent || null,
        voted_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      return { success: false, message: error.message };
    }
    
    // Обновление счетчика голосов в servers таблице
    const { data: server } = await supabase
      .from('servers')
      .select('id, total_votes')
      .eq('id', serverId)
      .single();
    
    if (server) {
      await supabase
        .from('servers')
        .update({ total_votes: (server.total_votes || 0) + 1 })
        .eq('id', serverId);
      
      // Обновление local state
      set((state) => ({
        ...state,
        hasVotedToday: true,
        lastVoteTime: new Date(),
        votesRemaining: state.votesRemaining > 0 ? state.votesRemaining - 1 : 0,
        serverVoteCounts: new Map(get().serverVoteCounts).set(serverId, (server.total_votes || 0) + 1),
      }));
    }
    
    return { 
      success: true, 
      message: 'Голос учтен!',
      serverVoteCount: (server?.total_votes || 0) + 1
    };
  },
  
  checkVoteStatus: async (serverId: string) => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      return {
        canVote: true,
        hasVotedToday: false,
        timeRemaining: null,
      };
    }
    
    const userId = user.id;
    const supabase = await createClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingVote } = await supabase
      .from('votes')
      .select('voted_at')
      .eq('server_id', serverId)
      .eq('user_id', userId)
      .gte('voted_at', today.toISOString())
      .maybeSingle();
    
    const canVote = !existingVote;
    const timeRemaining = canVote ? null : getTimeUntilNextVote();
    
    set({
      hasVotedToday: !canVote,
      lastVoteTime: existingVote ? new Date(existingVote.voted_at) : null,
    });
    
    return {
      canVote,
      hasVotedToday: !canVote,
      timeRemaining,
    };
  },
  
  loadVoteCounts: async (serverIds: string[]) => {
    const supabase = await createClient();
    
    const { data: votes } = await supabase
      .from('votes')
      .select('server_id')
      .in('server_id', serverIds);
    
    const counts = new Map<string, number>();
    
    if (votes) {
      votes.forEach((vote: any) => {
        const serverId = vote.server_id;
        counts.set(serverId, (counts.get(serverId) || 0) + 1);
      });
    }
    
    set({ serverVoteCounts: counts });
    return counts;
  },
  
  getVoteHistory: async (serverId: string, page: number = 1, limit: number = 20) => {
    const supabase = await createClient();
    const offset = (page - 1) * limit;
    
    const { data: votes } = await supabase
      .from('votes')
      .select(`
        *,
        servers!inner (
          name,
          slug,
          banner_url,
          logo_url
        )
      `)
      .eq('server_id', serverId)
      .order('voted_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    return votes || [];
  },
}));

function getTimeUntilNextVote(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else if (minutes > 0) {
    return `${minutes} мин`;
  } else {
    return '< 1 мин';
  }
}
