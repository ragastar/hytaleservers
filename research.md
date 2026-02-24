# HytaleServers.tech — Полное исследование кодовой базы

> Дата исследования: 2026-02-24
> Версия проекта: 0.1.0

---

## 1. Общее описание проекта

**HytaleServers.tech** — это платформа мониторинга игровых серверов Hytale. Пользователи могут:
- Просматривать список серверов с фильтрацией, сортировкой и поиском
- Голосовать за серверы (1 голос в день на сервер)
- Добавлять свои серверы на модерацию
- Управлять своими серверами (редактирование, удаление)
- Добавлять серверы в избранное
- Получать уведомления

Администраторы могут:
- Модерировать серверы (approve/reject)
- Управлять настройками сайта с версионированием
- Откатывать настройки к предыдущим версиям

---

## 2. Технологический стек

| Категория | Технология | Версия |
|-----------|-----------|--------|
| Фреймворк | Next.js (App Router) | 16.1.1 |
| Язык | TypeScript (strict mode) | 5.9.3 |
| UI-библиотека | React | 19.2.3 |
| CSS | Tailwind CSS v4 | 4.x |
| UI-компоненты | shadcn/ui (New York style) + Radix UI | — |
| Управление состоянием | Zustand | 5.0.10 |
| Кэширование данных | TanStack Query | 5.90.17 |
| База данных | Supabase (PostgreSQL) | — |
| Аутентификация | Supabase Auth | — |
| Хранилище файлов | Supabase Storage | — |
| Анимации | Framer Motion | 12.26.2 |
| Валидация | Zod | 4.3.5 |
| Иконки | lucide-react | 0.562.0 |
| Уведомления | Sonner | 2.0.7 |
| SEO | next-seo, next-sitemap | — |
| Хеширование паролей | bcryptjs | 3.0.3 |
| Деплой | PM2 + GitHub Actions | — |

---

## 3. Структура каталогов

```
hytaleservers/
├── .github/workflows/       # CI/CD (GitHub Actions)
│   └── deploy.yml           # Auto-deploy на VPS при push в main
├── .opencode/               # Конфигурация OpenCode
├── app/                     # Next.js App Router — страницы и API
│   ├── layout.tsx           # Корневой layout (Header, Footer, ThemeProvider, Sonner)
│   ├── page.tsx             # Главная страница (список серверов + баннер)
│   ├── globals.css          # Глобальные стили
│   ├── about/               # Страница "О проекте"
│   ├── privacy/             # Политика конфиденциальности
│   ├── terms/               # Условия использования
│   ├── auth/login/          # Вход через Supabase Auth
│   ├── auth/register/       # Регистрация через Supabase Auth
│   ├── login/               # Альтернативная страница входа
│   ├── register/            # Альтернативная страница регистрации
│   ├── add-server/          # Форма добавления сервера
│   ├── my-servers/          # Управление серверами пользователя
│   ├── profile/             # Профиль пользователя
│   ├── server-list/[slug]/  # Детальная страница сервера
│   ├── admin/               # Админ-панель
│   │   ├── page.tsx         # Дашборд модерации
│   │   ├── login/           # Вход в админку
│   │   ├── moderation/[id]/ # Модерация конкретного сервера
│   │   └── settings/        # Управление настройками сайта
│   ├── test/                # Тестовая страница
│   └── api/                 # API эндпоинты (14 штук)
│       ├── servers/         # CRUD серверов
│       ├── my-servers/      # Серверы текущего пользователя
│       ├── votes/           # Голосование
│       ├── categories/      # Категории
│       ├── upload/          # Загрузка изображений
│       ├── admin/           # Админские эндпоинты
│       ├── test/            # Тестовый эндпоинт
│       ├── supabase-test/   # Тест соединения с Supabase
│       └── debug/           # Отладочная информация
├── components/              # React-компоненты
│   ├── auth/                # Компоненты аутентификации
│   ├── server/              # Компоненты серверов (карточка, грид, голоса)
│   ├── shared/              # Общие компоненты (Header, Footer, Search, Filter)
│   ├── admin/               # Компоненты админ-панели
│   └── ui/                  # shadcn/ui примитивы (Button, Card, Input и др.)
├── lib/                     # Утилиты и сервисы
│   ├── supabase/            # Клиенты Supabase (server.ts, client.ts)
│   ├── store/               # Zustand-хранилища (auth, votes, favorites, messages, presence)
│   ├── hooks/               # React-хуки (useSiteSettings)
│   ├── utils/               # Утилиты (cn(), image helpers)
│   └── settings.ts          # Интерфейсы и дефолты настроек сайта
├── db/                      # SQL-скрипты вне миграций
│   ├── schema-updates.sql   # Обновления схемы
│   └── fix-owner-email.sql  # Миграция данных
├── supabase/                # Конфигурация Supabase
│   ├── migrations/          # 6 миграций (таблицы, профили, хранилище, настройки, избранное, голоса)
│   └── seed.sql             # Сидирование (категории, админ, настройки)
├── scripts/                 # Скрипты
│   ├── create-admin.ts      # Создание админа
│   ├── deploy-vps.sh        # Ручной деплой
│   ├── setup-storage.ts     # Инициализация бакетов
│   └── fix-storage.ts       # Исправление конфигурации хранилища
├── public/                  # Статические ресурсы
├── middleware.ts             # Защита /admin роутов
├── package.json             # Зависимости и скрипты
├── next.config.ts           # Конфигурация Next.js
├── tailwind.config.ts       # Конфигурация Tailwind (тёмная тема, CSS-переменные)
├── tsconfig.json            # TypeScript strict mode, алиас @/*
├── ecosystem.config.js      # PM2 production config (порт 3003)
├── eslint.config.mjs        # ESLint
├── components.json          # shadcn/ui конфиг
├── AGENTS.md                # Гайдлайны для AI-агентов
├── PROJECT_MAP.md           # Карта проекта
├── README.md                # Документация
├── HISTORY.md               # Хронология изменений
└── LOCAL_SETUP.md           # Инструкция по локальной настройке
```

---

## 4. Схема базы данных

### 4.1 Основные таблицы

#### `servers` — Серверы
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| name | text | Название сервера |
| slug | text (unique) | URL-slug (транслит из названия) |
| ip | text | IP-адрес сервера |
| port | integer | Порт сервера |
| short_description | text | Краткое описание |
| full_description | text | Полное описание |
| logo_url | text | URL логотипа (Supabase Storage) |
| banner_url | text | URL баннера (Supabase Storage) |
| website_url | text | Сайт сервера |
| discord_url | text | Discord сервера |
| owner_email | text | Email владельца |
| owner_id | uuid (FK → auth.users) | Владелец |
| secret_key | text | Секретный ключ для API |
| status | text | pending / approved / rejected / offline |
| current_players | integer | Текущие игроки онлайн |
| max_players | integer | Максимум игроков |
| last_ping_at | timestamptz | Последний пинг |
| uptime_percentage | decimal | Процент аптайма |
| total_votes | integer | Всего голосов |
| rating | decimal | Рейтинг |
| created_at | timestamptz | Дата создания |
| updated_at | timestamptz | Автообновление через триггер |

**Индексы:** status, rating, current_players, created_at

#### `categories` — Категории
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| name | text | Название (Survival, PvP, RPG и др.) |
| slug | text | URL-slug |
| icon | text | Эмоджи-иконка |
| description | text | Описание категории |

**Предустановлено 13 категорий:** Survival, PvP, PvE, RPG, Creative, Minigames, Anarchy, Economy, SkyBlock, Factions, Hardcore, Vanilla, Modded

#### `server_categories` — Связь сервер-категория (Many-to-Many)
| Поле | Тип | Описание |
|------|-----|----------|
| server_id | uuid (FK → servers) | Сервер |
| category_id | uuid (FK → categories) | Категория |

#### `votes` — Голоса
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| server_id | uuid (FK → servers) | Сервер |
| user_id | uuid (FK → auth.users) | Пользователь |
| ip_address | text | IP для анти-чита |
| user_agent | text | User-Agent для анти-чита |
| voted_at | timestamptz | Время голоса |

**Уникальный индекс:** (server_id, user_id, DATE(voted_at)) — 1 голос/день/сервер/пользователь

#### `profiles` — Профили пользователей
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK, FK → auth.users) | Пользователь |
| username | text | Имя пользователя |
| avatar_url | text | Аватар |
| xp | integer | Очки опыта |
| level | integer | Уровень |
| vote_streak | integer | Серия голосов |
| last_vote_date | date | Последнее голосование |
| preferences | jsonb | Пользовательские настройки |

**Триггер:** Автоматическое создание профиля при регистрации

#### `admin_users` — Администраторы
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| email | text (unique) | Email |
| password_hash | text | Хеш пароля (bcryptjs) |
| name | text | Имя |
| role | text | Роль (default: admin) |
| created_at | timestamptz | Дата создания |

#### `site_settings` — Настройки сайта
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| key | text (unique) | Ключ настройки |
| value | jsonb | Значение |
| type | text | Тип (string, number, boolean, json) |
| category | text | Категория настройки |
| history | jsonb | История версий |
| current_version | integer | Текущая версия |
| updated_at | timestamptz | Последнее обновление |
| updated_by | text | Кем обновлено |

#### `favorites` — Избранные серверы
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| user_id | uuid (FK → auth.users) | Пользователь |
| server_id | uuid (FK → servers) | Сервер |

**Уникальный индекс:** (user_id, server_id)

#### `messages` — Уведомления
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid (PK) | Идентификатор |
| user_id | uuid (FK → auth.users) | Получатель |
| title | text | Заголовок |
| content | text | Содержание |
| type | text | info / success / warning / error / system |
| link | text | Ссылка (опционально) |
| is_read | boolean | Прочитано |
| created_at | timestamptz | Дата создания |

#### `user_presence` — Присутствие пользователей
| Поле | Тип | Описание |
|------|-----|----------|
| user_id | uuid (PK, FK → auth.users) | Пользователь |
| status | text | online / away / offline |
| last_seen | timestamptz | Последняя активность |

**Триггеры:** Автосоздание записи при регистрации, автообновление last_seen

---

## 5. API эндпоинты

### 5.1 Публичные

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/servers` | Список серверов (pagination, filter, sort, search) |
| GET | `/api/servers/[id]` | Детали сервера (только approved) |
| GET | `/api/categories` | Список категорий |

**Параметры `/api/servers`:** page, limit, sort (rating/players/new/votes), category, search, status

### 5.2 Аутентифицированные (Supabase Auth)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/servers` | Добавить сервер (status=pending) |
| PATCH | `/api/servers/[id]` | Обновить сервер (только владелец) |
| DELETE | `/api/servers/[id]` | Удалить сервер (только владелец, каскадное удаление) |
| GET | `/api/my-servers` | Серверы текущего пользователя |
| POST | `/api/votes` | Проголосовать за сервер (1/день) |
| POST | `/api/upload` | Загрузка изображений |

### 5.3 Админские (cookie: admin_session)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/admin/login` | Вход в админку (bcryptjs) |
| POST | `/api/admin/logout` | Выход из админки |
| GET/POST | `/api/admin/settings/[key]` | Чтение/обновление настроек |
| GET | `/api/admin/settings/history/[key]` | История версий настройки |
| POST | `/api/admin/settings/rollback/[key]/[version]` | Откат настройки к версии |

### 5.4 Тестовые/отладочные

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/test` | Тест |
| GET | `/api/supabase-test` | Тест соединения с Supabase |
| GET | `/api/debug` | Отладочная информация |

---

## 6. Компоненты

### 6.1 Серверные компоненты (`components/server/`)

- **`ServerCard.tsx`** — Карточка сервера: баннер, статус онлайн/оффлайн, количество игроков, категории, кнопка копирования IP, кнопка голосования, рейтинг
- **`ServerGrid.tsx`** — Адаптивная сетка (3 колонки) для отображения списка серверов
- **`ServerStatus.tsx`** — Индикатор статуса сервера (online/offline) с цветовым кодированием
- **`VoteButton.tsx`** — Кнопка голосования с проверкой дневного лимита и обратной связью
- **`VoteCounter.tsx`** — Отображение счётчика голосов

### 6.2 Компоненты аутентификации (`components/auth/`)

- **`AuthForm.tsx`** — Универсальная форма входа/регистрации
- **`GoogleButton.tsx`** — Кнопка Google OAuth
- **`ProtectedRoute.tsx`** — Обёртка для защиты роутов (требует авторизации)
- **`AdminRoute.tsx`** — Обёртка для защиты админских роутов

### 6.3 Общие компоненты (`components/shared/`)

- **`Header.tsx`** — Шапка сайта: логотип, навигация, статус авторизации, переключатель темы. Градиентный фон, подсветка активного роута, плавные анимации
- **`Footer.tsx`** — Подвал: ссылки, соцсети, визуальные эффекты (огонь/вода)
- **`SearchBar.tsx`** — Поле поиска серверов
- **`HeaderSearch.tsx`** — Поиск, интегрированный в шапку
- **`FilterBar.tsx`** — Фильтры по категориям и статусу
- **`FavoritesDropdown.tsx`** — Дропдаун избранных серверов
- **`MessagesDropdown.tsx`** — Дропдаун уведомлений
- **`UserStatusIndicator.tsx`** — Индикатор онлайн/оффлайн пользователя

### 6.4 Админские компоненты (`components/admin/`)

- **`SettingsCard.tsx`** — Карточка секции настроек
- **`SettingField.tsx`** — Поле ввода отдельной настройки
- **`HistoryModal.tsx`** — Модалка с историей версий настройки

### 6.5 UI-примитивы (`components/ui/` — shadcn/ui)

Button, Card, Badge, Input, Textarea, Label, Alert, Avatar, Dialog, DropdownMenu, Select, Sheet, Switch, ImageUploader, ImagePreview, ThemeProvider, ThemeToggle

---

## 7. Управление состоянием (Zustand Stores)

### `authStore.ts`
- **Состояние:** user, loading, userStats, serverLimit, serversUsed
- **Методы:** initializeAuth(), signInWithEmail(), signUpWithEmail(), signOut(), fetchUserStats()
- **Особенности:** Слушатель изменений auth, синхронизация сессии

### `votesStore.ts`
- **Методы:** voteForServer(), checkVoteStatus(), loadVoteCounts(), getVoteHistory()
- **Особенности:** Кэш количества голосов, трекинг дневного лимита

### `favoritesStore.ts`
- Управление избранными серверами

### `messagesStore.ts`
- Управление уведомлениями пользователя

### `presenceStore.ts`
- Трекинг онлайн-статуса пользователей

---

## 8. Аутентификация и авторизация

### 8.1 Пользовательская аутентификация
- **Провайдер:** Supabase Auth (email/password)
- **Google OAuth:** Подготовлен компонент GoogleButton
- **Клиент-сайд:** Zustand authStore управляет состоянием
- **Сервер-сайд:** `supabase.auth.getUser()` в API-роутах

### 8.2 Админская аутентификация
- **Отдельная система:** Таблица admin_users + bcryptjs
- **Механизм:** Cookie `admin_session` (httpOnly, 24 часа)
- **Защита:** `middleware.ts` перехватывает все `/admin/*` роуты
- **Исключение:** `/admin/login` доступна без cookie

### 8.3 Авторизация API
- **Публичные роуты:** GET серверов и категорий
- **Аутентифицированные:** Проверка Supabase-сессии
- **Владелец:** Проверка owner_id при PATCH/DELETE серверов
- **Админ:** Проверка admin_session cookie

---

## 9. Система голосования

- Пользователь может голосовать **1 раз в день** за каждый сервер
- Уникальный индекс `(server_id, user_id, DATE(voted_at))` предотвращает дублирование
- Фиксируются **IP-адрес** и **User-Agent** для анти-чит защиты
- При голосовании обновляется `total_votes` в таблице `servers`
- У пользователей трекается **vote_streak** (серия голосов) в профиле

---

## 10. Система настроек сайта (CMS)

### Доступные настройки:
- **home_banner** — Баннер на главной странице
- **site_name / site_tagline** — Название и слоган сайта
- **social_links** — Ссылки на соцсети
- **seo_settings** — SEO метаданные
- **feature_flags** — Флаги фич
- **maintenance_mode** — Режим обслуживания

### Версионирование:
- Каждое изменение создаёт новую версию
- Хранится полная история изменений (поле `history` в JSONB)
- Возможен откат к любой предыдущей версии

---

## 11. Хранилище файлов (Supabase Storage)

| Бакет | Лимит | Доступ | Назначение |
|-------|-------|--------|-----------|
| server-logos | 2 МБ | Публичное чтение | Логотипы серверов |
| server-banners | 5 МБ | Публичное чтение | Баннеры серверов |

**RLS-политики:** Публичное чтение, загрузка/удаление только для авторизованных пользователей (собственные файлы)

---

## 12. Деплой и инфраструктура

### Локальная разработка
```bash
npm run dev    # http://localhost:3000 (Turbopack)
npm run build  # Продакшн-сборка
npm run lint   # ESLint
```

### Продакшн
- **Сервер:** VPS (путь: `/root/hytaleservers-tech`)
- **Процесс-менеджер:** PM2 (имя: `hytaleservers`, порт: 3003)
- **Домен:** https://hytaleservers.tech
- **Лимит памяти:** 1 ГБ (PM2 автоперезапуск)

### CI/CD (GitHub Actions)
- **Триггер:** Push в `main` или ручной запуск
- **Процесс:**
  1. Подключение по SSH к VPS
  2. `git pull origin main`
  3. Остановка PM2
  4. Очистка кэша (.next)
  5. `npm install && npm run build`
  6. Перезапуск PM2
  7. Проверка статуса
- **Секреты:** SSH_PRIVATE_KEY, VPS_HOST, VPS_USER, VPS_PATH

---

## 13. Особенности и паттерны кода

### 13.1 Клиенты Supabase
- **Серверный** (`lib/supabase/server.ts`): Использует `@supabase/ssr`, работает через cookies
- **Клиентский** (`lib/supabase/client.ts`): Для браузерных компонентов

### 13.2 Локализация
- **Интерфейс:** Только русский язык
- **Комментарии:** Русский для бизнес-логики, английский для технических пояснений
- **Переменные:** Только английские имена

### 13.3 Стилизация
- **Подход:** Utility-first (Tailwind)
- **Тёмная тема:** Class-based через `next-themes`
- **Цвета:** CSS-переменные (hsl), gradient Purple-500 → Cyan-500
- **Хелпер:** `cn()` для мерджинга классов (clsx + tailwind-merge)
- **Адаптивность:** Mobile-first (md:, lg:, xl: брейкпоинты)

### 13.4 Маршрутизация
- **Динамические роуты:** `/server-list/[slug]`, `/admin/moderation/[id]`
- **Две системы auth-страниц:** `/auth/login` + `/login` (альтернативная)
- **Middleware:** Защита `/admin/*` через проверку cookie

### 13.5 Формы и ошибки
- **Формы:** `handleSubmit` → try/catch → toast.success/toast.error (Sonner)
- **API:** try/catch → NextResponse.json с кодами статуса
- **Загрузка:** useState(loading) + useEffect + finally(() => setLoading(false))

---

## 14. Отсутствующие / незавершённые элементы

1. **Нет тестов** — Проект не содержит тестового набора. В AGENTS.md прямо указано: "No test suite exists - Always test manually after changes"
2. **Дублирование auth-страниц** — Есть `/auth/login` и `/login`, `/auth/register` и `/register`
3. **Тестовые/отладочные эндпоинты** — `/api/test`, `/api/debug`, `/api/supabase-test` остаются в коде
4. **Нет реального пинга серверов** — Поля `current_players`, `last_ping_at`, `uptime_percentage` существуют, но фоновый процесс мониторинга не реализован
5. **Google OAuth** — Компонент GoogleButton подготовлен, но полная интеграция может быть незавершена
6. **TanStack Query** — Установлен как зависимость, но основной data fetching выполняется через useEffect + fetch

---

## 15. Безопасность

### Сильные стороны:
- Row-Level Security (RLS) на уровне Supabase
- Параметризованные запросы через Supabase клиент
- httpOnly cookie для админ-сессии
- Проверка владельца при CRUD-операциях
- Хеширование паролей (bcryptjs)
- Анти-чит при голосовании (IP + User-Agent)
- `.gitignore` исключает `.env.local` и секреты

### Потенциальные улучшения:
- Supabase anon key и URL видны в `ecosystem.config.js` (публичный ключ, не критично, но лучше через .env)
- Admin session — простая cookie без JWT, без ротации
- Нет rate limiting на API-эндпоинтах
- Тестовые/отладочные эндпоинты не должны быть в продакшне

---

## 16. Ключевые файлы для работы

| Задача | Файлы |
|--------|-------|
| Новая страница | `app/<route>/page.tsx` |
| Новый компонент | `components/<category>/ComponentName.tsx` |
| Новый API | `app/api/<route>/route.ts` |
| Изменение БД | `supabase/migrations/00X_name.sql` |
| Состояние (store) | `lib/store/<name>Store.ts` |
| Настройки сайта | `lib/settings.ts` |
| Стили | `app/globals.css`, `tailwind.config.ts` |
| Деплой | `.github/workflows/deploy.yml`, `ecosystem.config.js` |

---

## 17. Выводы

Проект HytaleServers.tech — это полнофункциональная платформа мониторинга серверов с продуманной архитектурой. Используется современный стек (Next.js 16 + React 19 + Supabase + Tailwind v4). Код организован по стандартным паттернам Next.js App Router. Основные функции (листинг, голосование, модерация, CMS) реализованы и работают. Главные точки роста — добавление автотестов, реального мониторинга серверов (пинг), и очистка дублирующих/тестовых эндпоинтов.
