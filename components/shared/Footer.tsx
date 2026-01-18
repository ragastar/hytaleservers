import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-200 bg-zinc-900 dark:border-zinc-800 overflow-hidden">
      {/* Fire Effect - Left Side */}
      <div className="absolute left-0 bottom-0 w-1/3 h-full pointer-events-none">
        <div className="footer-fire-glow absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-orange-600/40 via-red-500/20 to-transparent" />
        <div className="footer-fire-glow absolute bottom-0 left-8 w-2/3 h-1/2 bg-gradient-to-t from-yellow-500/30 via-orange-400/15 to-transparent" style={{ animationDelay: '0.5s' }} />
        <div className="footer-fire-glow absolute bottom-0 left-16 w-1/2 h-1/3 bg-gradient-to-t from-red-600/35 via-orange-500/10 to-transparent" style={{ animationDelay: '1s' }} />
        {/* Embers */}
        <div className="footer-ember absolute bottom-12 left-12 w-2 h-2 rounded-full bg-orange-400" style={{ animationDelay: '0s' }} />
        <div className="footer-ember absolute bottom-16 left-24 w-1.5 h-1.5 rounded-full bg-yellow-400" style={{ animationDelay: '0.7s' }} />
        <div className="footer-ember absolute bottom-8 left-32 w-1 h-1 rounded-full bg-red-400" style={{ animationDelay: '1.4s' }} />
        <div className="footer-ember absolute bottom-20 left-8 w-1.5 h-1.5 rounded-full bg-orange-300" style={{ animationDelay: '0.3s' }} />
      </div>

      {/* Water Effect - Right Side */}
      <div className="absolute right-0 bottom-0 w-1/3 h-full pointer-events-none">
        <div className="footer-water-glow absolute bottom-0 right-0 w-full h-3/4 bg-gradient-to-t from-blue-600/40 via-cyan-500/20 to-transparent" />
        <div className="footer-water-glow absolute bottom-0 right-8 w-2/3 h-1/2 bg-gradient-to-t from-cyan-400/30 via-blue-400/15 to-transparent" style={{ animationDelay: '0.8s' }} />
        <div className="footer-water-glow absolute bottom-0 right-16 w-1/2 h-1/3 bg-gradient-to-t from-blue-500/35 via-cyan-300/10 to-transparent" style={{ animationDelay: '1.5s' }} />
        {/* Bubbles */}
        <div className="footer-bubble absolute bottom-10 right-12 w-2 h-2 rounded-full bg-cyan-300/60" style={{ animationDelay: '0s' }} />
        <div className="footer-bubble absolute bottom-14 right-24 w-1.5 h-1.5 rounded-full bg-blue-300/60" style={{ animationDelay: '1s' }} />
        <div className="footer-bubble absolute bottom-6 right-32 w-1 h-1 rounded-full bg-cyan-200/60" style={{ animationDelay: '2s' }} />
        <div className="footer-bubble absolute bottom-18 right-8 w-1.5 h-1.5 rounded-full bg-blue-200/60" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 via-purple-500 to-cyan-500">
                <span className="text-xl">🎮</span>
              </div>
              <span className="font-semibold text-white">HytaleServers.tech</span>
            </div>
            <p className="text-sm text-zinc-400">
              Лучший мониторинг серверов Hytale на русском языке.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-orange-400 transition-colors">
                  Серверы
                </Link>
              </li>
              <li>
                <Link href="/add-server" className="text-zinc-400 hover:text-orange-400 transition-colors">
                  Добавить сервер
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-orange-400 transition-colors">
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Правовая информация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-cyan-400 transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Контакты</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a
                  href="https://t.me/hytaleservers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@hytaleservers.tech"
                  className="hover:text-cyan-400 transition-colors"
                >
                  support@hytaleservers.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-700 pt-8 text-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} HytaleServers.tech. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
