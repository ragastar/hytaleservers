import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                <span className="text-xl">🎮</span>
              </div>
              <span className="font-semibold text-foreground">HytaleServers.tech</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Лучший мониторинг серверов Hytale на русском языке.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  Серверы
                </Link>
              </li>
              <li>
                <Link href="/add-server" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  Добавить сервер
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Правовая информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://t.me/hytaleservers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@hytaleservers.tech"
                  className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  support@hytaleservers.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} HytaleServers.tech. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
