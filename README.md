# Hytaleservers.tech

Мониторинг и топ-лист серверов Hytale на русском языке

## Технический стек

- **Frontend:** Next.js 16.1.1 + React 19.2.3 + TypeScript 5
- **Styling:** Tailwind CSS 4 + shadcn/ui + Framer Motion
- **Database:** Supabase (PostgreSQL)
- **State:** Zustand 5.0.10 + TanStack Query 5.90.17
- **Deployment:** PM2 (VPS) + GitHub Actions

## Development

### Prerequisites
- Node.js 20+
- npm 10+
- Git

### Local Setup

1. **Клонирование репозитория**
```bash
git clone https://github.com/USERNAME/hytaleservers-tech.git
cd hytaleservers-tech
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
```bash
cp .env.local.example .env.local
```

Открой `.env.local` и заполните следующие значения:

**Supabase Configuration:**
- `NEXT_PUBLIC_SUPABASE_URL` - ваш Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ваш Supabase ANON key
- `SUPABASE_SERVICE_ROLE_KEY` - ваш Supabase service role key

**Site Configuration:**
- `NEXT_PUBLIC_SITE_URL` - для локалки: `http://localhost:3000`

**Analytics (опционально):**
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_YANDEX_METRIKA_ID` - Yandex Metrika ID

**Интеграции (опционально):**
- `TELEGRAM_BOT_TOKEN` - токен Telegram бота
- `STRIPE_SECRET_KEY` - Stripe секретный ключ

4. **Запуск dev сервера**
```bash
npm run dev
```

5. **Открытие в браузере**
```
http://localhost:3000
```

### Database Setup

Проект использует Supabase с существующими миграциями:

```bash
# Если установлен Supabase CLI
supabase migration up
supabase db seed

# Или через Supabase Dashboard
1. Откройте: https://supabase.com/dashboard/project/ncxelqwplkhlhvbmdatf
2. SQL Editor → Execute SQL from file
3. Выполните миграции из supabase/migrations/
4. Выполните seed.sql для тестовых данных
```

## Available Commands

### Development
```bash
npm run dev          # Запустить dev сервер (порт 3000)
npm run build        # Создать production билд
npm start            # Запустить production сервер
npm run lint         # Проверить код на ошибки
```

### Setup
```bash
npm run create-admin # Создать админа
npm run deploy       # Деплой на VPS
```

### PM2 (на VPS)
```bash
pm2 status                    # Проверить статус
pm2 logs hytaleservers        # Просмотреть логи
pm2 restart hytaleservers     # Перезапустить
pm2 stop hytaleservers        # Остановить
pm2 start hytaleservers       # Запустить
```

## Deployment

### Automatic Deploy (GitHub Actions)

**Настройка:**

1. **Генерация SSH ключей на VPS**
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions
```

2. **Добавление публичного ключа**
```bash
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys
```

3. **Добавление секретов в GitHub**
   - Settings → Secrets and variables → Actions → New repository secret
   - Добавить:
     - `GH_SSH_PRIVATE_KEY` - содержимое `~/.ssh/github_actions`
     - `VPS_HOST` - IP адрес или домен VPS
     - `VPS_USER` - пользователь (обычно `root`)
     - `VPS_PATH` - путь к проекту (`/root/hytaleservers-tech`)

**Использование:**
```bash
# После настройки просто пуш в main
git add .
git commit -m "feat: new feature"
git push origin main
```

Деплой произойдёт автоматически. Проверьте статус в:
- Actions tab в GitHub
- `pm2 logs hytaleservers` на VPS

### Manual Deploy

**На VPS:**
```bash
cd /root/hytaleservers-tech
git pull origin main
npm install --production
npm run build
pm2 restart hytaleservers
```

**Или одной командой:**
```bash
./scripts/deploy-vps.sh
```

## Project Structure

```
hytaleservers-tech/
├── app/                    # Next.js App Router
│   ├── api/                # API routes (11 endpoints)
│   ├── page.tsx            # Главная страница
│   └── layout.tsx          # Root layout
├── components/             # React компоненты
│   ├── server/             # Компоненты серверов
│   ├── shared/             # Общие компоненты
│   └── ui/                 # shadcn/ui компоненты
├── lib/                    # Утилиты
│   ├── supabase/           # Supabase клиенты
│   └── utils/              # Helper функции
├── supabase/               # База данных
│   ├── migrations/         # SQL миграции (001-003)
│   └── seed.sql            # Тестовые данные
├── scripts/                # Утилиты
│   ├── create-admin.ts     # Создание админа
│   └── deploy-vps.sh       # Скрипт деплоя
├── .env                    # Переменные окружения (VPS)
└── .env.local              # Переменные окружения (local)
```

## API Routes

### Public
- `GET /api/servers` - Список серверов (пагинация, фильтры, сортировка)
- `GET /api/servers/[id]` - Детали сервера
- `GET /api/categories` - Список категорий
- `GET /api/test` - Тестовый endpoint

### Auth Required
- `GET /api/my-servers` - Мои серверы
- `POST /api/upload` - Загрузка изображений (логотип/баннер)
- `GET /api/admin-moderation/[id]` - Очередь модерации

### Admin
- `POST /api/admin/login` - Логин админа
- `POST /api/admin/logout` - Логаут админа

### Debug
- `GET /api/debug` - Debug информация
- `GET /api/supabase-test` - Тест подключения к Supabase

## Database

### Tables
- `servers` - Серверы Hytale
- `categories` - Категории серверов
- `server_categories` - Связь сервер-категория
- `votes` - Голоса за серверы
- `admin_users` - Админы

### Migrations
1. `001_initial_schema.sql` - Основная схема
2. `002_profiles.sql` - Профили пользователей
3. `003_storage.sql` - Storage buckets (логотипы, баннеры)

### Seed Data
- 14 категорий (survival, pvp, pve, rpg, creative, etc.)
- 3 тестовых сервера

## Environment Variables

### Local Development (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_YANDEX_METRIKA_ID=

# Optional Integrations
TELEGRAM_BOT_TOKEN=
STRIPE_SECRET_KEY=
```

### Production (.env on VPS)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3003
# (или https://hytaleservers.tech)
```

## Documentation

- **HISTORY.md** - Хронология изменений проекта (история итераций, решения, проблемы)
- **PROJECT_MAP.md** - Детальная документация проекта (553 строки)
- **LOCAL_SETUP.md** - Инструкции по локальной настройке для AI
- **.opencode/skills/hytaleservers-workflow/SKILL.md** - Проектный скилл

## Contributing

1. Создайте feature branch
2. Внесите изменения
3. Тестируйте локально
4. Создайте PR на GitHub
5. После merge → автодеплой на VPS

## License

MIT

## Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ncxelqwplkhlhvbmdatf
- **GitHub Repository:** (будет создан)
- **Local URL:** http://localhost:3000
- **Production URL:** http://localhost:3003 (или https://hytaleservers.tech)
