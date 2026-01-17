-- Categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Выживание', 'survival', '⛏️', 'Классическое выживание в мире Hytale'),
  ('PvP', 'pvp', '⚔️', 'Игровые серверы с PvP режимом'),
  ('PvE', 'pve', '🛡️', 'Игровые серверы с PvE режимом'),
  ('RPG', 'rpg', '🎭', 'Ролевые серверы с квестами'),
  ('Творчество', 'creative', '🎨', 'Творческие сервера для строительства'),
  ('Мини-игры', 'minigames', '🎮', 'Серверы с различными мини-играми'),
  ('Анархия', 'anarchy', '💀', 'Серверы без правил и гриндии'),
  ('Экономика', 'economy', '💰', 'Серверы с развитой экономикой'),
  ('SkyBlock', 'skyblock', '🏝️', 'Серверы в режиме SkyBlock'),
  ('Фракции', 'factions', '🏰', 'Серверы с системой фракций'),
  ('Хардкор', 'hardcore', '💪', 'Хардкорные сервера с высокой сложностью'),
  ('Ванилла', 'vanilla', '🌿', 'Чистый ванильный сервер без модов'),
  ('Моддед', 'modded', '🔧', 'Серверы с модами и плагинами')
ON CONFLICT (slug) DO NOTHING;

-- Test servers (3 example servers)
INSERT INTO servers (name, slug, ip, port, short_description, full_description, owner_email, secret_key, status, current_players, max_players) VALUES
  ('HyWorld Survival', 'hyworld-survival', 'play.hyworld.net', 25565, 'Лучший русский сервер для выживания и создания друзей', 'HyWorld Survival - это дружелюбное комьюнити для любителей выживания. У нас есть:\n\n- Клики и войны\n- Экономика\n- Магазин\n- Приваты\n\nПрисоединяйся к нам!', 'admin@hyworld.net', gen_random_uuid()::text, 'approved', 45, 100),
  ('PvP Arena', 'pvp-arena', 'arena.pvp-server.com', 25565, 'Ежедневные PvP турниры с призами', 'PvP Arena - лучшие бои на Hytale!\n\nОсобенности:\n- Дуэли 1v1\n- Турниры 5v5\n- Батл-рояль\n- Еженедельные события\n\nЗабирай призы за победу!', 'contact@pvparena.com', gen_random_uuid()::text, 'approved', 78, 200),
  ('Creative Build', 'creative-build', 'build.creative.net', 25565, 'Безлимитные приваты для твоих творений', 'Creative Build - лучший сервер для строительства!\n\nНаши фичи:\n- Платформы WorldEdit\n- Безлимитные приваты\n- Тематические конкурсы\n- Школы для новичков\n\nСоздавай вместе с нами!', 'admin@creativebuild.net', gen_random_uuid()::text, 'approved', 32, 150)
ON CONFLICT (slug) DO NOTHING;

-- Assign categories to test servers
-- HyWorld Survival: Survival, Economy
INSERT INTO server_categories (server_id, category_id)
SELECT s.id, c.id
FROM servers s
JOIN categories c ON c.slug IN ('survival', 'economy')
WHERE s.slug = 'hyworld-survival'
ON CONFLICT DO NOTHING;

-- PvP Arena: PvP, Minigames
INSERT INTO server_categories (server_id, category_id)
SELECT s.id, c.id
FROM servers s
JOIN categories c ON c.slug IN ('pvp', 'minigames')
WHERE s.slug = 'pvp-arena'
ON CONFLICT DO NOTHING;

-- Creative Build: Creative
INSERT INTO server_categories (server_id, category_id)
SELECT s.id, c.id
FROM servers s
JOIN categories c ON c.slug = 'creative'
WHERE s.slug = 'creative-build'
ON CONFLICT DO NOTHING;
