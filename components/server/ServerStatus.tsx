import { Badge } from "@/components/ui/badge";

interface ServerStatusProps {
  status: 'online' | 'offline' | 'pending';
  showText?: boolean;
}

export function ServerStatus({ status, showText = true }: ServerStatusProps) {
  const config = {
    online: {
      variant: 'default' as const,
      className: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
      icon: '🟢',
      label: 'Онлайн',
    },
    offline: {
      variant: 'secondary' as const,
      className: 'bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30',
      icon: '🔴',
      label: 'Оффлайн',
    },
    pending: {
      variant: 'default' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600 text-white dark:bg-yellow-600 dark:hover:bg-yellow-700',
      icon: '🟡',
      label: 'Модерация',
    },
  };

  const current = config[status];

  return (
    <Badge className={`gap-1.5 ${current.className}`}>
      <span className="text-sm">{current.icon}</span>
      {showText && <span>{current.label}</span>}
    </Badge>
  );
}
