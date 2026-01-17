-- Servers table
CREATE TABLE IF NOT EXISTS servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  ip VARCHAR(255) NOT NULL,
  port INTEGER DEFAULT 25565,
  short_description VARCHAR(160) NOT NULL,
  full_description TEXT,
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  website_url VARCHAR(255),
  discord_url VARCHAR(255),
  owner_email VARCHAR(255) NOT NULL,
  secret_key VARCHAR(64) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, offline
  current_players INTEGER DEFAULT 0,
  max_players INTEGER DEFAULT 100,
  last_ping_at TIMESTAMP,
  uptime_percentage DECIMAL(5,2) DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon VARCHAR(50),
  description TEXT
);

-- Server categories junction table
CREATE TABLE IF NOT EXISTS server_categories (
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (server_id, category_id)
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID REFERENCES servers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  voted_at TIMESTAMP DEFAULT NOW()
);

-- Unique constraint for votes (one vote per user per server per day)
CREATE UNIQUE INDEX idx_unique_vote ON votes (server_id, user_id, DATE(voted_at));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_servers_rating ON servers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_servers_players ON servers(current_players DESC);
CREATE INDEX IF NOT EXISTS idx_servers_created ON servers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_server_date ON votes(server_id, voted_at);
CREATE INDEX IF NOT EXISTS idx_server_categories_server ON server_categories(server_id);
CREATE INDEX IF NOT EXISTS idx_server_categories_category ON server_categories(category_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
