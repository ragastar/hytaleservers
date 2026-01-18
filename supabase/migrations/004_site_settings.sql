-- Site settings table for managing site content through admin panel
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(50) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  type VARCHAR(20) NOT NULL,
  category VARCHAR(50) NOT NULL,
  label VARCHAR(100),
  description TEXT,
  history JSONB DEFAULT '[]'::jsonb,
  current_version INT DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_site_settings_type ON site_settings(type);
CREATE INDEX IF NOT EXISTS idx_site_settings_updated ON site_settings(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);

-- Update timestamp function for site_settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
