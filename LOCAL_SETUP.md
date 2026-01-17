# LOCAL SETUP - Инструкции для AI ассистента

Этот файл содержит инструкции для автоматической настройки локального окружения проекта Hytaleservers.tech.

## Обзор проекта

**Название:** Hytaleservers.tech  
**Описание:** Мониторинг и топ-лист серверов Hytale  
**Стек:** Next.js 16.1.1 + React 19.2.3 + TypeScript 5 + Tailwind CSS 4 + Supabase  
**Текущий порт (local):** 3000  
**Текущий порт (production):** 3003 (VPS)

## Инструкции для AI ассистента

### Шаг 1: Проверка окружения

#### 1.1 Проверка Node.js
```bash
node --version
```

**Ожидаемый результат:** v20.0.0 или выше

**Если Node.js не установлен или версия ниже v20:**
1. Сообщи пользователю: "Node.js не установлен или версия ниже v20. Пожалуйста, установите Node.js LTS версии 20 или выше с https://nodejs.org/"
2. Предложи инструкции:
   - Скачать инсталлятор с https://nodejs.org/ (выбрать LTS)
   - Установить, следуя инструкциям
   - Перезагрузить терминал
   - Проверить снова: `node --version`

#### 1.2 Проверка npm
```bash
npm --version
```

**Ожидаемый результат:** 10.0.0 или выше

**Если npm не установлен:**
- npm устанавливается вместе с Node.js
- Сообщи: "npm должен был установиться вместе с Node.js. Пожалуйста, переустановите Node.js"

#### 1.3 Проверка Git
```bash
git --version
```

**Ожидаемый результат:** 2.30.0 или выше

**Если Git не установлен:**
1. Сообщи: "Git не установлен. Пожалуйста, установите Git с https://git-scm.com/downloads"
2. Предложи инструкции для Windows:
   - Скачать с https://git-scm.com/download/win
   - Установить, следуя инструкциям
   - Перезагрузить терминал
   - Проверить снова: `git --version`

### Шаг 2: Клонирование репозитория

**Проверка:** Уже в директории hytaleservers-tech?

Если **ДА** (пользователь уже склонировал проект):
- Пропусти этот шаг, переходи к Шагу 3

Если **НЕТ** (нужно склонировать):
```bash
git clone https://github.com/USERNAME/hytaleservers-tech.git
cd hytaleservers-tech
```

**ЗАМЕНИ USERNAME** на реальный username пользователя!

### Шаг 3: Настройка переменных окружения

#### 3.1 Создание .env.local
```bash
cp .env.local.example .env.local
```

#### 3.2 Заполнение .env.local

Открой `.env.local` и заполните следующие значения:

**ВАЖНО: Использовать один и тот же Supabase проект для локалки и продакшн!**

**Из VPS (.env) скопировать:**
- `NEXT_PUBLIC_SUPabase_URL` - должен быть: `https://ncxelqwplkhlhvbmdatf.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - полный ключ (длинный JWT токен)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - должен быть: `sb_publishable_h4MJcTegWY2W93zWfGmkVQ_E2QSDnRH`
- `SUPABASE_SERVICE_ROLE_KEY` - полный сервисный ключ

**Для локальной разработки установить:**
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000` (изменить с prod URL)

**Оставить пустыми:**
- `NEXT_PUBLIC_GA_ID=` (для локалки)
- `NEXT_PUBLIC_YANDEX_METRIKA_ID=` (для локалки)
- `TELEGRAM_BOT_TOKEN=` (пустой для локалки)
- `TELEGRAM_WEBHOOK_SECRET=` (пустой для локалки)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=` (пустой для локалки)
- `STRIPE_SECRET_KEY=` (пустой для локалки)
- `STRIPE_WEBHOOK_SECRET=` (пустой для локалки)

**ПРОВЕРКА:** После заполнения проверь что `.env.local` существует:
```bash
cat .env.local | head -20
```

### Шаг 4: Установка зависимостей

```bash
npm install
```

**Ожидаемый результат:** Успешная установка без ошибок

**Если есть ошибки:**
1. Проверь что Node.js версии 20+
2. Проверь что npm версии 10+
3. Попробуй: `npm cache clean --force` и затем `npm install`
4. Если ошибки продолжаются - сообщи пользователю

**ПРОВЕРКА:** Проверь что `node_modules` создан:
```bash
ls -la node_modules | head -10
```

### Шаг 5: Запуск dev сервера

```bash
npm run dev
```

**Ожидаемый результат:**
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
```

**Сервер должен запуститься на порту 3000!**

**ПРОВЕРКА:** Открой в браузере http://localhost:3000

### Шаг 6: Тестирование

#### 6.1 Проверка API endpoints
```bash
# В другом терминале
curl http://localhost:3000/api/test
```

**Ожидаемый результат:**
```json
{"status":"ok","message":"API is working","timestamp":"..."}
```

```bash
curl http://localhost:3000/api/supabase-test
```

**Ожидаемый результат:**
```json
{"success":true,"data":[...]}
```

#### 6.2 Проверка UI
Открой в браузере:
- http://localhost:3000 - главная страница
- http://localhost:3000/about - страница о проекте
- http://localhost:3000/api/servers - API servers

### Шаг 7: Проверка Supabase подключения

**Загрузка главной страницы должна показать:**
- Список серверов (если есть в БД)
- Категории
- Корректное отображение UI

**Если API возвращает пустой список:**
1. Проверь `.env.local` что Supabase URL и ключи правильные
2. Проверь что Supabase проект доступен: https://ncxelqwplkhlhvbmdatf.supabase.co
3. Проверь консоль браузера на ошибки

### Шаг 8: Итоговая проверка

**Проверить список файлов:**
```bash
ls -la
```

**Ожидаемые файлы:**
- ✅ .env.local (создан)
- ✅ node_modules (создан)
- ✅ package.json (существует)
- ✅ NEXT.js приложение готово

**Проверить что dev сервер запущен:**
- Открой http://localhost:3000
- Проверь что страница загружается без ошибок
- Проверь консоль браузера на ошибки

## Доступные команды

### Development
- `npm run dev` - запустить dev сервер (порт 3000)
- `npm run build` - создать production билд
- `npm start` - запустить production сервер
- `npm run lint` - запустить линтинг

### Setup
- `npm run create-admin` - создать админа (из scripts/create-admin.ts)
- `npm run deploy` - деплой на VPS (через scripts/deploy-vps.sh)

## Информация о проекте

### Структура
```
app/              # Next.js App Router
├── api/          # API routes (11 endpoints)
├── page.tsx      # Главная страница
└── layout.tsx    # Root layout

components/       # React компоненты
├── server/       # Server компоненты
├── shared/       # Общие компоненты
└── ui/           # shadcn/ui компоненты

lib/              # Утилиты
├── supabase/     # Supabase клиенты
└── utils/        # Helper функции

supabase/         # База данных
├── migrations/   # Миграции (001-003)
└── seed.sql      # Тестовые данные
```

### Supabase
- **URL:** https://ncxelqwplkhlhvbmdatf.supabase.co
- **Storage buckets:** server-logos, server-banners
- **Миграции:** 001_initial_schema.sql, 002_profiles.sql, 003_storage.sql
- **Seed данные:** 14 категорий, 3 тестовых сервера

### API Routes
- `GET /api/servers` - список серверов
- `GET /api/servers/[id]` - детали сервера
- `GET /api/categories` - список категорий
- `GET /api/test` - тест API
- `GET /api/debug` - debug endpoint
- `GET /api/supabase-test` - тест Supabase
- `POST /api/admin/login` - логин админа
- `POST /api/admin/logout` - логаут админа
- `GET /api/my-servers` - мои серверы (требует auth)
- `POST /api/upload` - загрузка изображений
- `GET /api/admin-moderation/[id]` - модерация (admin)

## Workflow разработки

1. Создай feature branch: `git checkout -b feature/xxx`
2. Внеси изменения
3. Тестируй локально: `npm run dev`
4. Зафиксируй: `git commit -m "feat: xxx"`
5. Запуши: `git push origin feature/xxx`
6. Создай PR на GitHub
7. После merge → автодеплой на VPS (порт 3003)

## Важные файлы

- `PROJECT_MAP.md` - детальная документация проекта
- `README.md` - основной README с инструкциями
- `package.json` - зависимости и скрипты
- `.env.local` - локальные переменные окружения (не коммитить!)

## Частые проблемы

### Проблема: Node.js версии ниже v20
**Решение:** Обнови Node.js до версии 20+ с https://nodejs.org/

### Проблема: npm install не работает
**Решение:** 
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### Проблема: Dev сервер не запускается на порту 3000
**Решение:** Проверь что порт 3000 не занят:
```bash
# Windows
netstat -ano | findstr :3000

# Если занят, убей процесс или используй другой порт:
npm run dev -- -p 3001
```

### Проблема: Supabase connection error
**Решение:** 
1. Проверь `.env.local` что ключи правильные
2. Проверь что Supabase проект доступен
3. Проверь консоль браузера на ошибки

### Проблема: Пустой список серверов
**Решение:** Это нормально если в БД нет данных. Seed данные можно добавить через Supabase dashboard.

## Следующие шаги

После успешной локальной настройки:

1. **Протестируй функционал:**
   - Добавь тестовый сервер (через форму или API)
   - Проверь категории
   - Проверь поиск и фильтры

2. **Сделай первый коммит:**
```bash
git add .
git commit -m "chore: local environment setup complete"
```

3. **Начни разработку:**
   - Создай feature branch
   - Вноси изменения
   - Пуши в GitHub

4. **Тестируй деплой:**
   - Пушни изменения
   - Проверь что автодеплой работает
   - Проверь VPS на порту 3003

## Дополнительные ресурсы

- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **PROJECT_MAP.md** - детальная документация проекта

---

**Примечание:** Этот файл используется AI ассистентом для автоматической настройки локального окружения. Все инструкции предназначены для автоматического выполнения.
