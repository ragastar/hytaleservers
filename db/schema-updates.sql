-- ========================================
-- Очистка существующих данных
-- ========================================

-- Удалить все существующие серверы и связи
DELETE FROM server_categories;
DELETE FROM servers;

-- ========================================
-- Добавление owner_id в таблицу servers
-- ========================================

ALTER TABLE servers
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Добавить индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON servers(owner_id);

-- ========================================
-- Создание таблицы admin_users
-- ========================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Вставить первого админа (пароль захеширован в bcrypt)
INSERT INTO admin_users (email, password_hash)
VALUES ('shuffle.org@bk.ru', '$2b$10$n4OETQvwmx3nXPi3pG1yxuBCcrRXQn/iJ0/tXkeScumFxNMQqF4I.')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- Создание таблицы user_server_limits
-- ========================================

CREATE TABLE IF NOT EXISTS user_server_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  max_servers INT DEFAULT 3,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- RLS Policies для таблицы servers
-- ========================================

-- Включить RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Удалить старые политики если есть
DROP POLICY IF EXISTS "Users can view their own servers" ON servers;
DROP POLICY IF EXISTS "Users can insert their own servers" ON servers;
DROP POLICY IF EXISTS "Users can update their own servers" ON servers;
DROP POLICY IF EXISTS "Users can delete their own servers" ON servers;
DROP POLICY IF EXISTS "Public can view approved servers" ON servers;

-- Создать новые политики
CREATE POLICY "Users can view their own servers"
ON servers FOR SELECT
USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own servers"
ON servers FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own servers"
ON servers FOR UPDATE
USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own servers"
ON servers FOR DELETE
USING (auth.uid() = owner_id);

CREATE POLICY "Public can view approved servers"
ON servers FOR SELECT
USING (status = 'approved');

-- ========================================
-- Функция для проверки лимита серверов
-- ========================================

CREATE OR REPLACE FUNCTION check_server_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_limit INT;
  server_count INT;
BEGIN
  -- Получить лимит для пользователя
  SELECT COALESCE(max_servers, 3) INTO user_limit
  FROM user_server_limits
  WHERE user_id = NEW.owner_id;

  -- Если нет записи, использовать лимит по умолчанию (3)
  IF user_limit IS NULL THEN
    user_limit :=3;
  END IF;

  -- Посчитать количество серверов пользователя
  SELECT COUNT(*) INTO server_count
  FROM servers
  WHERE owner_id = NEW.owner_id;

  -- Проверить лимит
  IF server_count >= user_limit THEN
    RAISE EXCEPTION 'Server limit (%) servers exceeded for this user', user_limit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Удалить старый триггер если есть
DROP TRIGGER IF EXISTS trg_check_server_limit ON servers;

-- Создать триггер
CREATE TRIGGER trg_check_server_limit
BEFORE INSERT ON servers
FOR EACH ROW
EXECUTE FUNCTION check_server_limit();

-- ========================================
-- Представление для статистики пользователей
-- ========================================

CREATE OR REPLACE VIEW user_stats AS
SELECT 
  owner_id,
  COUNT(*) AS total_servers,
  SUM(current_players) AS total_online,
  SUM(total_votes) AS total_votes,
  MAX(created_at) AS last_added
FROM servers
WHERE owner_id IS NOT NULL
GROUP BY owner_id;

-- ========================================
-- RLS Policies для user_server_limits
-- ========================================

ALTER TABLE user_server_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own limits"
ON user_server_limits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own limits"
ON user_server_limits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own limits"
ON user_server_limits FOR UPDATE
USING (auth.uid() = user_id);

-- ========================================
-- Комментарии для документации
-- ========================================

COMMENT ON TABLE admin_users IS 'Администраторы системы';
COMMENT ON TABLE user_server_limits IS 'Лимиты серверов для пользователей';
COMMENT ON VIEW user_stats IS 'Статистика серверов по пользователям';
COMMENT ON FUNCTION check_server_limit() IS 'Проверяет лимит серверов пользователя перед созданием';
