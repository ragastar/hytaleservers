-- Home page settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('home_banner_enabled', true::jsonb, 'boolean', 'home', 'Показать баннер на главной', 'Включение/выключение баннера на главной странице'),
  ('home_banner_url', '"https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=400&fit=crop"'::jsonb, 'image', 'home', 'Баннер главной страницы', 'Картинка-баннер на главной странице (1200x400px)');

-- General settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('site_name', '"HytaleServers.tech"'::jsonb, 'text', 'general', 'Название сайта', 'Название которое отображается в заголовке'),
  ('site_tagline', '"Мониторинг серверов Hytale на русском"'::jsonb, 'text', 'general', 'Слоган сайта', 'Короткое описание сайта'),
  ('site_logo_url', null::jsonb, 'image', 'general', 'Логотип сайта', 'Логотип для сайта и favicon (512x512px)'),
  ('site_favicon_url', null::jsonb, 'image', 'general', 'Favicon сайта', 'Иконка сайта во вкладке браузера (64x64px)');

-- Pages settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('about_page_image', null::jsonb, 'image', 'pages', 'Картинка страницы "О проекте"', 'Картинка-баннер для страницы О проекте'),
  ('about_page_content', '"HytaleServers.tech — это лучший мониторинг серверов Hytale на русском языке."'::jsonb, 'text', 'pages', 'Содержимое страницы "О проекте"', 'Текст для страницы О проекте'),
  ('privacy_page_content', '""'::jsonb, 'text', 'pages', 'Политика конфиденциальности', 'Политика конфиденциальности'),
  ('terms_page_content', '""'::jsonb, 'text', 'pages', 'Условия использования', 'Условия использования сайта');

-- Social networks settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('social_telegram', '"https://t.me/hytaleservers"'::jsonb, 'text', 'socials', 'Telegram', 'Ссылка на Telegram канал'),
  ('social_discord', '""'::jsonb, 'text', 'socials', 'Discord', 'Ссылка на Discord сервер'),
  ('contact_email', '"support@hytaleservers.tech"'::jsonb, 'text', 'socials', 'Email для контактов', 'Email для связи'),
  ('contact_youtube', '""'::jsonb, 'text', 'socials', 'YouTube', 'Ссылка на YouTube канал'),
  ('contact_vk', '""'::jsonb, 'text', 'socials', 'VK', 'Ссылка на группу VK');

-- SEO settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('seo_title', '"HytaleServers.tech - Мониторинг серверов Hytale на русском"'::jsonb, 'text', 'seo', 'SEO заголовок', 'Заголовок для SEO (title tag)'),
  ('seo_description', '"Найди лучший сервер Hytale на русском языке. Топ серверов, рейтинги, отзывы, онлайн мониторинг."'::jsonb, 'text', 'seo', 'SEO описание', 'Описание для SEO (meta description)'),
  ('seo_keywords', '"hytale, сервера, мониторинг, top, рейтинг, русский"'::jsonb, 'text', 'seo', 'SEO ключевые слова', 'Ключевые слова через запятую');

-- Analytics settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('analytics_ga_id', '""'::jsonb, 'text', 'analytics', 'Google Analytics ID', 'Google Analytics 4 Measurement ID (G-XXXXXXXXXX)'),
  ('analytics_ym_id', '""'::jsonb, 'text', 'analytics', 'Яндекс Метрика ID', 'ID Яндекс Метрики (XXXXXXXXXX)');

-- Features settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('feature_registration_enabled', true::jsonb, 'boolean', 'features', 'Включить регистрацию', 'Позволяет пользователям регистрироваться'),
  ('feature_voting_enabled', true::jsonb, 'boolean', 'features', 'Включить голосование', 'Позволяет голосовать за серверы'),
  ('feature_server_submission_enabled', true::jsonb, 'boolean', 'features', 'Включить добавление серверов', 'Позволяет пользователям добавлять свои серверы');

-- System settings
INSERT INTO site_settings (key, value, type, category, label, description) VALUES
  ('maintenance_mode', false::jsonb, 'boolean', 'system', 'Режим обслуживания', 'Включает режим обслуживания для всех пользователей'),
  ('maintenance_message', '"Сайт временно недоступен. Попробуйте позже."'::jsonb, 'text', 'system', 'Сообщение о обслуживании', 'Сообщение которое показывается в режиме обслуживания'),
  ('beta_mode', false::jsonb, 'boolean', 'system', 'Beta режим', 'Показывает badge что сайт в beta тестировании');
