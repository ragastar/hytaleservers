'use client';

import { Check, Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VoteCounterProps {
  voteCount: number;
  maxVotes?: number;
  showMaxVotes?: boolean;
}

export function VoteCounter({ voteCount, maxVotes = 1000, showMaxVotes = false }: VoteCounterProps) {
  const percentage = (voteCount / maxVotes) * 100;
  
  // Определение цвета и статуса
  let variant: 'default' | 'secondary' | 'outline' = 'default';
  let status: 'common' | 'rare' | 'epic' = 'common';
  let icon = <Star className="h-4 w-4" />;
  
  if (percentage >= 80) {
    variant = 'default';
    status = 'epic';
    icon = <Trophy className="h-4 w-4 text-yellow-400" />;
  } else if (percentage >= 50) {
    variant = 'secondary';
    status = 'rare';
  }
  
  return (
    <div className="flex items-center gap-2">
      <Badge variant={variant} className="gap-1.5">
        {icon}
        <span className="font-semibold">{voteCount}</span>
        {showMaxVotes && (
          <span className="text-muted-foreground">/ {maxVotes}</span>
        )}
      </Badge>
    </div>
  );
}
