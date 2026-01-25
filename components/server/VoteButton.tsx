'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

interface VoteButtonProps {
  serverId: string;
  voteCount: number;
  hasVotedToday?: boolean;
  onVote?: () => void;
}

export function VoteButton({ serverId, voteCount, hasVotedToday, onVote }: VoteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasVotedTodayLocal, setHasVotedToday] = useState(false);
  const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
  
  useEffect(() => {
    const checkVoteStatus = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setHasVotedToday(false);
        return;
      }
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: existingVote } = await supabase
        .from('votes')
        .select('voted_at')
        .eq('server_id', serverId)
        .eq('user_id', user.id)
        .gte('voted_at', today.toISOString())
        .maybeSingle();
      
      setHasVotedToday(!!existingVote);
    };
    
    checkVoteStatus();
  }, [serverId]);
  
  const handleVote = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы голосовать');
      return;
    }
    
    if (hasVotedTodayLocal) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server_id: serverId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при голосовании');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setHasVotedToday(true);
        setCurrentVoteCount(result.voteCount || currentVoteCount + 1);
        
        if (onVote) {
          onVote();
        }
      } else {
        alert(result.message || 'Ошибка при голосовании');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Ошибка при голосовании');
    } finally {
      setIsLoading(false);
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
          <span className="text-green-600 dark:text-green-400">{currentVoteCount}</span>
        </>
      ) : (
        <>
          <ThumbsUp className="h-4 w-4" />
          {currentVoteCount}
        </>
      )}
    </Button>
  );
}
