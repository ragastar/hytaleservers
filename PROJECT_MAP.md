# Hytaleservers.tech - Карта проекта

## 📋 Обзор проекта

**Название:** Hytaleservers.tech
**Описание:** Мониторинг и топ-лист серверов Hytale
**Статус:** В разработке (Production готов)
**Последнее обновление:** 16 Января 2026
**Версия:** 0.1.0

---

## 🛠 Технический стек

### Frontend
- **Framework:** Next.js 16.1.1 (App Router)
- **UI Library:** React 19.2.3
- **Language:** TypeScript 5.x
- **Styling:**
  - Tailwind CSS 4
  - shadcn/ui (New York style)
  - Radix UI (Select, Slot)
  - tw-animate-css
  - Framer Motion 12.26.2 (анимации)
  - class-variance-authority, clsx, tailwind-merge

### State & Data
- **State Management:** Zustand 5.0.10
- **Data Fetching:** TanStack Query 5.90.17
- **Validation:** Zod 4.3.5

### Backend & API
- **API Framework:** Next.js API Routes
- **Server-Side Rendering:** Next.js SSR с @supabase/ssr

### Database
- **Provider:** Supabase (PostgreSQL)
- **Client:** @supabase/supabase-js 2.90.1
- **SSR Client:** @supabase/ssr 0.8.0

### Deployment
- **Process Manager:** PM2 (production)
- **Port:** 3002 (порт 3000 занят Open WebUI)
- **Environment:** Linux (Ubuntu)

### Development
- **Package Manager:** npm
- **Build Tool:** Turbopack (Next.js 16)
- **Linting:** ESLint 9 + eslint-config-next

---

## 📁 Структура проекта

```
hytaleservers-tech/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Главная страница (список серверов)
│   ├── layout.tsx                # Корневой layout
│   ├── globals.css               # Глобальные стили
│   ├── about/                    # Страница "О проекте"
│   │   └── page.tsx
│   ├── server/                   # Детали сервера
│   │   └── [slug]/page.tsx
│   └── api/                     # API Routes
│       ├── debug/                # Debug endpoint
│       │   └── route.ts
│       ├── test/                 # Test endpoint
│       │   └── route.ts
│       ├── supabase-test/        # Supabase connection test
│       │   └── route.ts
│       └── servers/             # Servers API
│           ├── route.ts          # GET /api/servers (список серверов)
│           ├── [slug]/route.ts   # GET /api/servers/:slug (детали сервера)
│           └── test/route.ts    # Test endpoint для servers
├── components/                  # React компоненты
│   ├── server/                  # Компоненты серверов
│   │   ├── ServerCard.tsx       # Карточка сервера
│   │   ├── ServerGrid.tsx       # Сетка серверов
│   │   └── ServerStatus.tsx     # Индикатор статуса
│   ├── shared/                  # Общие компоненты
│   │   ├── Header.tsx          # Шапка сайта
│   │   ├── Footer.tsx          # Подвал сайта
│   │   └── SearchBar.tsx       # Поиск по серверам
│   ├── seo/                    # SEO компоненты
│   └── ui/                     # shadcn/ui компоненты
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── input.tsx
│       ├── select.tsx
│       └── alert.tsx
├── lib/                        # Утилиты и конфиги
│   ├── supabase/
│   │   ├── server.ts           # Supabase SSR клиент
│   │   └── client.ts          # Supabase Browser клиент
│   ├── seo/                    # SEO конфиги
│   ├── utils.ts                # cn() утилита для Tailwind
│   └── utils/                 # Дополнительные утилиты
├── supabase/                   # Supabase конфигурация
│   ├── migrations/              # Миграции БД
│   │   ├── 001_initial_schema.sql
│   │   └── 002_profiles.sql
│   ├── seed.sql                 # Тестовые данные
│   └── functions/               # Edge Functions (пока пусто)
├── public/                     # Статические файлы
│   ├── favicon.ico
│   └── (другие статики)
├── components.json             # shadcn/ui конфиг
├── ecosystem.config.js         # PM2 конфигурация
├── next.config.ts             # Next.js конфиг
├── tsconfig.json              # TypeScript конфиг
├── tailwind.config.ts         # Tailwind конфиг
├── postcss.config.mjs         # PostCSS конфиг
├── eslint.config.mjs          # ESLint конфиг
├── package.json              # Зависимости
└── .env                     # Переменные окружения
```

---

## 🗄️ База данных

### Таблицы

#### 1. `servers` - Серверы Hytale
```sql
- id (UUID, PK)
- name (VARCHAR(100)) - Название сервера
- slug (VARCHAR(100), UNIQUE) - URL-friendly имя
- ip (VARCHAR(255)) - IP адрес
- port (INTEGER) - Порт (по умолчанию 25565)
- short_description (VARCHAR(160)) - Краткое описание
- full_description (TEXT) - Полное описание
- logo_url (VARCHAR(500)) - Логотип
- banner_url (VARCHAR(500)) - Баннер
- website_url (VARCHAR(255)) - Сайт
- discord_url (VARCHAR(255)) - Discord
- owner_email (VARCHAR(255)) - Email владельца
- secret_key (VARCHAR(64), UNIQUE) - Секретный ключ для API
- status (VARCHAR(20)) - pending, approved, rejected, offline
- current_players (INTEGER) - Текущий онлайн
- max_players (INTEGER) - Макс. игроков
- last_ping_at (TIMESTAMP) - Последний ping
- uptime_percentage (DECIMAL(5,2)) - Аптайм в %
- total_votes (INTEGER) - Всего голосов
- rating (DECIMAL(3,2)) - Рейтинг
- created_at (TIMESTAMP) - Дата создания
- updated_at (TIMESTAMP) - Дата обновления
```

#### 2. `categories` - Категории серверов
```sql
- id (UUID, PK)
- name (VARCHAR(50)) - Название категории
- slug (VARCHAR(50), UNIQUE) - URL-friendly имя
- icon (VARCHAR(50)) - Иконка (emoji)
- description (TEXT) - Описание категории
```

**Существующие категории:**
- Выживание (survival) ⛏️
- PvP (pvp) ⚔️
- PvE (pve) 🛡️
- RPG (rpg) 🎭
- Творчество (creative) 🎨
- Мини-игры (minigames) 🎮
- Анархия (anarchy) 💀
- Экономика (economy) 💰
- SkyBlock (skyblock) 🏝️
- Фракции (factions) 🏰
- Хардкор (hardcore) 💪
- Ванилла (vanilla) 🌿
- Моддед (modded) 🔧

#### 3. `server_categories` - Связь сервер-категория
```sql
- server_id (UUID, FK servers.id, PK)
- category_id (UUID, FK categories.id, PK)
```

#### 4. `votes` - Голоса за серверы
```sql
- id (UUID, PK)
- server_id (UUID, FK servers.id)
- user_id (UUID, FK auth.users.id)
- ip_address (INET)
- user_agent (TEXT)
- voted_at (TIMESTAMP)
```

**Уникальное ограничение:** Один голос за сервер в день (server_id, user_id, DATE(voted_at))

### Индексы
- `idx_servers_status` - по статусу сервера
- `idx_servers_rating` - по рейтингу (DESC)
- `idx_servers_players` - по онлайну (DESC)
- `idx_servers_created` - по дате создания (DESC)
- `idx_votes_server_date` - для голосов
- `idx_server_categories_server` - для связей
- `idx_server_categories_category` - для связей

### Триггеры
- `update_servers_updated_at` - автоматическое обновление `updated_at` при изменении

---

## 🔌 API Endpoints

### GET `/api/servers`
**Описание:** Получить список серверов с пагинацией, фильтрацией и сортировкой

**Query Parameters:**
- `page` (number, default: 1) - Страница
- `limit` (number, default: 20) - Количество на странице
- `sort` (string, default: rating) - Сортировка: `rating`, `players`, `new`, `votes`
- `category` (string) - Фильтр по категории slug
- `search` (string) - Поиск по имени
- `status` (string, default: approved) - Статус сервера

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Server Name",
      "slug": "server-slug",
      "ip": "server.com",
      "port": 25565,
      "online_players": 45,
      "max_players": 100,
      "short_description": "...",
      "full_description": "...",
      "logo_url": "https://...",
      "banner_url": "https://...",
      "website_url": "https://...",
      "discord_url": "https://...",
      "categories": ["survival", "economy"],
      "status": "approved",
      "total_votes": 0,
      "rating": 0,
      "uptime_percentage": 0,
      "created_at": "2026-01-15T21:41:39.374083"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

**File:** `app/api/servers/route.ts`

---

### GET `/api/servers/[slug]`
**Описание:** Получить детальную информацию о сервере

**Response:**
```json
{
  "server": {
    // Полная информация о сервере
  },
  "categories": [...]
}
```

**File:** `app/api/servers/[slug]/route.ts`

---

### GET `/api/supabase-test`
**Описание:** Тест подключения к Supabase

**Response:**
```json
{
  "success": true,
  "data": [...],
  "envUrl": "https://ncx...",
  "hasKey": true,
  "keyLength": 208
}
```

**File:** `app/api/supabase-test/route.ts`

---

### GET `/api/debug`
**Описание:** Debug endpoint для отладки

**File:** `app/api/debug/route.ts`

---

## 🧩 Компоненты

### Server Components

#### ServerCard.tsx
**Описание:** Карточка сервера с логотипом, статусом, онлайном

**Props:**
- `name`, `slug`, `ip`, `port`
- `onlinePlayers`, `maxPlayers`
- `description`
- `logoUrl`
- `categories`
- `status` ('online' | 'offline')

**File:** `components/server/ServerCard.tsx`

---

#### ServerGrid.tsx
**Описание:** Сетка серверов с поддержкой пустого состояния

**Props:**
- `servers: Server[]`

**File:** `components/server/ServerGrid.tsx`

---

#### ServerStatus.tsx
**Описание:** Индикатор статуса онлайн/оффлайн

**File:** `components/server/ServerStatus.tsx`

---

### Shared Components

#### Header.tsx
**Описание:** Шапка сайта с навигацией

**File:** `components/shared/Header.tsx`

---

#### Footer.tsx
**Описание:** Подвал сайта

**File:** `components/shared/Footer.tsx`

---

#### SearchBar.tsx
**Описание:** Поле поиска по серверам

**Props:**
- `onSearch: (query: string) => void`

**File:** `components/shared/SearchBar.tsx`

---

### UI Components (shadcn/ui)

#### button.tsx
**Варианты:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Размеры:** `default`, `sm`, `lg`, `icon`

---

#### card.tsx
**Компоненты:** Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

---

#### badge.tsx
**Варианты:** `default`, `secondary`, `destructive`, `outline`

---

## ⚙️ Конфигурация

### Переменные окружения (.env)

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ncxelqwplkhlhvbmdatf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (JWT токен)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_... (альтернативный ключ)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG... (сервисный ключ)

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://hytaleservers.tech

# Analytics (настроить позже)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_YANDEX_METRIKA_ID=

# Optional: Telegram Bot (настроить позже)
TELEGRAM_BOT_TOKEN=
TELEGRAM_WEBHOOK_SECRET=

# Optional: Stripe (настроить позже)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

### NPM Scripts (package.json)

```json
{
  "dev": "next dev",           // Dev сервер (порт 3002)
  "build": "next build",       // Production билд
  "start": "next start",       // Production сервер
  "lint": "eslint"            // Линтинг
}
```

---

### PM2 Configuration (ecosystem.config.js)

```javascript
{
  name: 'hytaleservers',
  script: 'npm',
  args: 'start',
  cwd: '/root/hytaleservers-tech',
  instances: 1,
  env: {
    NODE_ENV: 'production',
    PORT: 3002,
    NEXT_PUBLIC_SITE_URL: 'https://hytaleservers.tech',
    NEXT_PUBLIC_SUPABASE_URL: 'https://ncxelqwplkhlhvbmdatf.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '...',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: '...',
    SUPABASE_SERVICE_ROLE_KEY: '...'
  }
}
```

**Статус:** ✅ Запущен (online)
**Автозапуск:** ✅ Настроен через systemd

---

## 📊 Статистика проекта

- **Общее количество файлов:** 29 (TS/TSX)
- **Общее количество строк кода:** 1527
- **Компонентов:** 13
- **API Routes:** 7
- **База данных:** 4 таблицы
- **Миграций:** 2
- **Seed данных:** 14 категорий + 3 тестовых сервера

---

## ✅ Текущее состояние

### Настроено и работает:
- ✅ Next.js 16 с App Router
- ✅ Supabase подключение (ANON KEY)
- ✅ API endpoints (servers, supabase-test)
- ✅ PM2 production сервер (порт 3002)
- ✅ Supabase Skills для OpenCode (5 skills)
- ✅ shadcn/ui компоненты
- ✅ Tailwind CSS 4

### Проблемы:
- ⚠️ Service Role KEY устарел (используется ANON KEY)
- ⚠️ Порт 3000 занят (Docker Open WebUI)
- ⚠️ Frontend (Header/Footer) может не быть реализован полностью
- ⚠️ Страница About пуста
- ⚠️ Page `/server/[slug]` может не быть реализована полностью

### Не настроено:
- ❌ Analytics (GA, Yandex Metrika)
- ❌ Telegram Bot
- ❌ Stripe интеграция
- ❌ Edge Functions
- ❌ Система голосований
- ❌ Мониторинг онлайна (ping)
- ❌ Админ-панель
- ❌ Регистрация/авторизация серверов

---

## 🔧 Рекомендации по дальнейшей разработке

### Приоритет 1 - Критично:
1. **Получить правильный Service Role KEY** из Supabase Dashboard
2. **Реализовать страницу About** (`app/about/page.tsx`)
3. **Реализовать страницу Server Details** (`app/server/[slug]/page.tsx`)

### Приоритет 2 - Важно:
4. **Настроить Analytics** (GA, Yandex Metrika)
5. **Реализовать систему голосований**
6. **Мониторинг онлайна** (cron job для ping серверов)
7. **Форма добавления серверов**

### Приоритет 3 - Полезно:
8. **Telegram Bot для уведомлений**
9. **Админ-панель для модерации**
10. **Фильтры и поиск на главной странице**
11. **Пагинация**
12. **SEO оптимизация** (meta теги, sitemap)

---

## 🌐 Доступные сервисы

### Supabase Skills для OpenCode
- ✅ `supabase-database` - CRUD операции
- ✅ `supabase-auth` - Аутентификация
- ✅ `supabase-storage` - Файлы
- ✅ `supabase-realtime` - Realtime подписки
- ✅ `supabase-edge-functions` - Edge функции

**Перемные окружения настроены:**
```bash
export SUPABASE_URL="https://ncxelqwplkhlhvbmdatf.supabase.co"
export SUPABASE_KEY="eyJhbGc..."
```

---

## 📝 Примечания

- **Текущий порт:** 3002 (изменен с 3001 из-за конфликта)
- **Lockfile конфликт:** Next.js использует `/root/package-lock.json` вместо `/root/hytaleservers-tech/package-lock.json` (предупреждение Turbopack)
- **Service Role KEY:** Требуется обновление для серверных операций
- **RLS Policies:** Не настроены в Supabase (требуется для безопасности)
- **CORS:** Не настроен для cross-origin запросов

---

## 🔗 Полезные ссылки

- **Supabase Dashboard:** https://supabase.com/dashboard/project/ncxelqwplkhlhvbmdatf
- **Supabase API Docs:** https://supabase.com/docs/guides/api
- **Next.js Docs:** https://nextjs.org/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **PM2 Docs:** https://pm2.keymetrics.io/docs

---

**Последнее обновление карты:** 16 Января 2026
**Статус карты:** Актуальная ✅
