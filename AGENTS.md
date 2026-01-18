# HytaleServers.tech - AI Agent Guidelines

## Build & Development Commands

```bash
npm run dev              # Start development server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server (port 3003)
npm run lint             # Run ESLint
npm run create-admin     # Create admin user via CLI
npm run deploy           # Deploy to VPS (requires SSH access)
```

**No test suite exists** - Always test manually after changes.

## Project Architecture

- **Framework**: Next.js 16.1.1 with App Router
- **Runtime**: Node.js (server components) + Client Components for interactivity
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives wrapped in custom components

## Code Style Guidelines

### Imports & Path Aliases

```typescript
// Always use @/ alias for project root imports
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store/authStore"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"          // External packages without @/
```

- Order: React imports → External packages → Internal imports (@/)
- No relative imports (../components/X) - always use @/

### Component Structure

**Client Components** (interactive, stateful):
```typescript
'use client';

import { useState, useEffect } from 'react';

export function ComponentName() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // effect logic
  }, [dependency]);

  return (
    <div className="container mx-auto">
      {/* JSX */}
    </div>
  );
}
```

**Server Components** (default, no 'use client'):
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.from('table').select('*');

  return <div>{/* JSX */}</div>;
}
```

### Naming Conventions

- **Files**: PascalCase for components (`Header.tsx`), kebab-case for utilities (`image-utils.ts`)
- **Components**: PascalCase, named exports preferred (`export function Header()`)
- **Functions/Variables**: camelCase (`fetchUserStats`, `handleSignOut`)
- **Constants**: SCREAMING_SNAKE_CASE for env vars, PascalCase for React constants
- **Interfaces/Types**: PascalCase, descriptive (`UserStats`, `AuthState`)

### TypeScript & Types

- **Strict mode enabled** - All code must be properly typed
- **No `any` types** - Use proper interfaces or unknown with type guards
- **Props interfaces** - Define component props explicitly
- **Error types** - Use union types for error handling

```typescript
interface UserStats {
  totalServers: number;
  totalOnline: number;
  totalVotes: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initializeAuth: () => Promise<void>;
}
```

### Error Handling

**API Routes**:
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!requiredField) {
      return NextResponse.json(
        { error: 'Description' },
        { status: 400 }
      );
    }

    // Logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Context:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
```

**Client Components**:
```typescript
try {
  await someAsyncOperation();
  toast.success('Success message');
} catch (error) {
  console.error('Error context:', error);
  toast.error('Error message');
}
```

### Styling & Tailwind

- **Utility-first**: Use Tailwind classes directly
- **Responsive**: Mobile-first, add md:, lg:, xl: breakpoints
- **Dark mode**: Always include `dark:` variants
- **Custom utils**: Use `cn()` for className merging

```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)} />
```

**Color scheme**:
- Primary: Purple-500 to Cyan-500 gradient
- Dark mode: dark:border-zinc-800, dark:bg-zinc-900
- Text: text-foreground, text-muted-foreground

### API Routes (Next.js 15+)

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const param = searchParams.get('param');

  // Logic
  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Logic
  return NextResponse.json({ success: true });
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface StoreState {
  state: Type;
  action: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  state: initialValue,

  action: async () => {
    // Can access other state via get()
    const currentState = get().state;
    // Update state via set()
    set({ state: newValue });
  },
}));
```

### Supabase Usage

**Server-side**:
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value);
```

**Client-side**:
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data } = await supabase.auth.getUser();
```

## File Organization

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Pages
├── components/
│   ├── auth/              # Auth components
│   ├── server/            # Server-related components
│   ├── shared/            # Shared UI components
│   └── ui/                # Primitive UI components (Button, Input, etc.)
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── store/             # Zustand stores
│   └── utils.ts           # Utility functions (cn, etc.)
└── public/                # Static assets
```

## Language & Localization

- **UI Text**: Russian language only
- **Comments**: Russian for business logic, English for technical explanations
- **Error Messages**: Russian, user-friendly
- **Variable Names**: English, technical terms

```typescript
// Компонент для отображения списка серверов
export function ServerList() {
  return <div>Серверы</div>;
}
```

## Git Workflow

```bash
git checkout main
git pull origin main
git checkout -b feature/branch-name
# Make changes
git add .
git commit -m "feat: description in Russian or English"
git push origin feature/branch-name
# Create PR, review, merge to main
```

**Commit message format**:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code refactoring
- `test:` tests (if added)
- `chore:` maintenance

## Deployment

- **VPS**: `/root/hytaleservers-tech`
- **Port**: 3003 (production)
- **PM2**: Process name `hytaleservers`
- **Deployment**: GitHub Actions workflow auto-deploys on push to main

## Security Notes

- **No secrets in code** - Use Supabase env vars, GitHub Secrets for VPS
- **Auth protected routes** - Use ProtectedRoute or AdminRoute components
- **API validation** - Validate inputs, check auth before operations
- **SQL injection** - Supabase handles this, use parameterized queries

## Common Patterns

### Form Handling
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await someApiCall();
    toast.success('Успешно!');
  } catch (error) {
    toast.error('Ошибка');
  }
};
```

### Loading States
```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().finally(() => setLoading(false));
}, []);

if (loading) return <LoadingSpinner />;
```

### Data Fetching
```typescript
useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(data => setData(data.data || []))
    .catch(err => console.error(err));
}, []);
```

## Environment Variables

Defined in `ecosystem.config.js` for production:
- `NEXT_PUBLIC_SITE_URL`: https://hytaleservers.tech
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: Supabase publishable key

**Never** commit `.env.local` or secrets to git.

## Important Notes

- Always run `npm run lint` after making changes
- Test both light and dark modes
- Verify mobile responsiveness
- Check console for errors in browser DevTools
- Russian language for all user-facing text
- No existing test suite - manual testing required
