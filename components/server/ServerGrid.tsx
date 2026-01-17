import { ServerCard } from "./ServerCard";

interface Server {
  id: string;
  name: string;
  slug: string;
  ip: string;
  port: number;
  online_players: number;
  max_players: number;
  short_description: string;
  logo_url?: string;
  categories?: string[];
  status: string;
  current_players?: number;
}

interface ServerGridProps {
  servers: Server[];
}

export function ServerGrid({ servers }: ServerGridProps) {
  if (servers.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">
            Серверов нет
          </p>
          <p className="text-sm text-muted-foreground">
            Станьте первым, кто добавит сервер!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <ServerCard
          key={server.id}
          name={server.name}
          slug={server.slug}
          ip={server.ip}
          port={server.port}
          onlinePlayers={server.current_players || server.online_players || 0}
          maxPlayers={server.max_players || 100}
          description={server.short_description}
          logoUrl={server.logo_url}
          categories={server.categories}
          status={(server.current_players && server.current_players > 0) ? 'online' : 'offline'}
        />
      ))}
    </div>
  );
}
