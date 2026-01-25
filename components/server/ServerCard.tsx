import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Copy, Check } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ServerStatus } from "./ServerStatus";

interface ServerCardProps {
  name: string;
  slug: string;
  ip: string;
  port: number;
  onlinePlayers: number;
  maxPlayers: number;
  description: string;
  bannerUrl?: string;
  categories?: {
    slug: string;
    name: string;
    icon: string;
  }[];
  rating?: number;
  totalVotes?: number;
  status?: 'online' | 'offline';
}

function PlaceholderBanner() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-muted p-4">
      <div className="text-4xl">🖼️</div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Нет баннера
      </p>
    </div>
  );
}

function CategoryBadge({ icon, name }: { icon: string; name: string }) {
  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      <span className="text-sm">{icon}</span>
      <span>{name}</span>
    </Badge>
  );
}

interface RatingDisplayProps {
  rating?: number;
  votes?: number;
}

function RatingDisplay({ rating = 0, votes = 0 }: RatingDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="gap-1.5">
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({votes} голосов)</span>
      </Badge>
    </div>
  );
}

function CopyButton({ ip, port }: { ip: string; port: number }) {
  const [copied, setCopied] = useState(false);
  const fullAddress = `${ip}:${port}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2 text-xs text-muted-foreground hover:bg-muted"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="truncate">{fullAddress}</span>
    </Button>
  );
}

export function ServerCard({
  name,
  slug,
  ip,
  port,
  onlinePlayers,
  maxPlayers,
  description,
  bannerUrl,
  categories = [],
  rating = 0,
  totalVotes = 0
}: ServerCardProps) {
  return (
    <Link href={`/server-list/${slug}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/10">
        <CardContent className="p-4">
          <div className="flex gap-4">
            
            <div className="flex shrink-0 flex-col gap-2">
              <div className="relative h-[130px] w-[180px] overflow-hidden rounded-lg bg-muted">
                {bannerUrl ? (
                  <img
                    src={bannerUrl}
                    alt={name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <PlaceholderBanner />
                )}
              </div>
              <CopyButton ip={ip} port={port} />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <div className="mt-1 flex items-center gap-2">
                  <ServerStatus status={onlinePlayers > 0 ? 'online' : 'offline'} showText={false} />
                  <span className="text-sm text-muted-foreground">
                    {onlinePlayers}/{maxPlayers}
                  </span>
                </div>
              </div>

              {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 3).map((cat) => (
                    <CategoryBadge key={cat.slug} icon={cat.icon} name={cat.name} />
                  ))}
                </div>
              )}

              <p className="line-clamp-2 text-sm text-muted-foreground">
                {description}
              </p>

              <RatingDisplay rating={rating} votes={totalVotes} />
            </div>

          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
