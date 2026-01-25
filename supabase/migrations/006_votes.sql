-- Votes table for server voting system
-- Пользователи могут голосовать за серверы 1 раз в день
-- Защита от накрутки: ограничение по IP адресу (1 голос/день)

CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  voted_at TIMESTAMP DEFAULT NOW()
);

-- Unique index for anti-spam protection
CREATE UNIQUE INDEX IF NOT EXISTS idx_votes_unique_vote ON votes(server_id, user_id, DATE(voted_at));

CREATE INDEX IF NOT EXISTS idx_votes_server ON votes(server_id);
CREATE INDEX IF NOT EXISTS idx_votes_user ON votes(user_id);

-- RLS Policies
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert votes" ON votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes" ON votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes" ON votes
  FOR DELETE USING (auth.uid() = user_id);
