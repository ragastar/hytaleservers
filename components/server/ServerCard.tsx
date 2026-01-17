import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ServerCardProps {
  name: string;
  slug: string;
  ip: string;
  port: number;
  onlinePlayers: number;
  maxPlayers: number;
  description: string;
  logoUrl?: string;
  categories?: string[];
  status?: 'online' | 'offline';
}

export function ServerCard({
  name,
  slug,
  ip,
  port,
  onlinePlayers,
  maxPlayers,
  description,
  logoUrl,
  categories = [],
  status = 'offline'
}: ServerCardProps) {
  return (
    <Link href={`/server-list/${slug}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {logoUrl && (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
              <img
                src={logoUrl}
                alt={name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {ip}:{port}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {onlinePlayers}/{maxPlayers}
                  </span>
                </div>
              </div>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
            {categories && categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {categories.slice(0, 3).map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
