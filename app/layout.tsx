import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HytaleServers.tech - Мониторинг серверов Hytale на русском",
    template: "%s | HytaleServers.tech"
  },
  description: "Найди лучший сервер Hytale на русском языке. Топ серверов, рейтинги, отзывы, онлайн мониторинг. Добавь свой сервер бесплатно!",
  keywords: ["hytale", "сервера", "мониторинг", "top", "рейтинг", "русский"],
  authors: [{ name: "HytaleServers.tech" }],
  creator: "HytaleServers.tech",
  metadataBase: new URL("https://hytaleservers.tech"),
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://hytaleservers.tech",
    siteName: "HytaleServers.tech",
    title: "HytaleServers.tech - Мониторинг серверов Hytale на русском",
    description: "Найди лучший сервер Hytale на русском языке. Топ серверов, рейтинги, отзывы.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HytaleServers.tech - Мониторинг серверов Hytale на русском",
    description: "Найди лучший сервер Hytale на русском языке. Топ серверов, рейтинги, отзывы.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
