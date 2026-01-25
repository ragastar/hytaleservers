'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVotesStore } from '@/lib/store/votesStore';
import { useAuthStore } from '@/lib/store/authStore';

interface VoteButtonProps {
  serverId: string;
  voteCount: number;
  hasVotedToday?: boolean;
  onVote?: () => void;
}

export function VoteButton({ serverId, voteCount, hasVotedToday, onVote }: VoteButtonProps) {
  const { voteForServer } = useVotesStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasVotedTodayLocal, setHasVotedToday] = useState(false);
  
  useEffect(() => {
    const checkStatus = async () => {
      const status = await useVotesStore.getState().checkVoteStatus(serverId);
      setHasVotedToday(status.hasVotedToday);
    };
    
    checkStatus();
  }, [serverId]);
  
  const handleVote = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы голосовать');
      return;
    }
    
    if (hasVotedTodayLocal) {
      return;
    }
    
    setIsLoading(true);
    const result = await voteForServer(serverId);
    setIsLoading(false);
    
    if (result?.success) {
      setHasVotedToday(true);
    } else {
      alert(result?.message || 'Ошибка при голосовании');
    }
    
    if (onVote) {
      onVote();
    }
  };
  
  return (
    <Button
      onClick={(e) => e.stopPropagation()}
      disabled={isLoading || hasVotedTodayLocal}
      variant={hasVotedTodayLocal ? "outline" : "default"}
      size="default"
      className="gap-2 font-medium"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : hasVotedTodayLocal ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="text-green-600 dark:text-green-400">{voteCount}</span>
        </>
      ) : (
        <>
          <ThumbsUp className="h-4 w-4" />
          {voteCount}
        </>
      )}
    </Button>
  );
}
