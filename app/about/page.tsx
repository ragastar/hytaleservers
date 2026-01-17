export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="container mx-auto px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold text-foreground">
            О проекте
          </h1>

          <div className="mb-8 space-y-6">
            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">
                Наша миссия
              </h2>
              <p className="text-lg text-muted-foreground">
                HytaleServers.tech создан, чтобы помочь игрокам найти лучшие серверы Hytale на русском языке.
                Мы объединяем удобный поиск, честные рейтинги и активное комьюнити в один сервис.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">
                Что мы предлагаем
              </h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Умный поиск</h3>
                    <p className="text-muted-foreground">
                      Найди сервер под свои предпочтения по категориям, онлайну и рейтингу
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">🗳️</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Честные рейтинги</h3>
                    <p className="text-muted-foreground">
                      Голосуй за любимые сервера и влияй на топ
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <h3 className="font-semibold text-foreground">Telegram бот</h3>
                    <p className="text-muted-foreground">
                      Мониторинг серверов прямо в Telegram (скоро)
                    </p>
                  </div>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">
                Для владельцев серверов
              </h2>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Добавьте свой сервер бесплатно и привлечи новых игроков!
                </p>
                <a
                  href="/add-server"
                  className="inline-block rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 px-6 py-3 text-white hover:from-purple-600 hover:to-cyan-600"
                >
                  Добавить сервер
                </a>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold text-foreground">
                Связаться с нами
              </h2>
              <p className="text-muted-foreground">
                Если у вас есть вопросы или предложения, свяжитесь с нами:
              </p>
              <div className="mt-4 space-y-2">
                <a
                  href="mailto:support@hytaleservers.tech"
                  className="block text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  support@hytaleservers.tech
                </a>
                <a
                  href="https://t.me/hytaleservers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Telegram канал
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
