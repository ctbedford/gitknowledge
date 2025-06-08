import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { Lora, Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontSerif = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Knowledge Cathedral',
  description: 'A living repository of interconnected thoughts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-serif antialiased",
          fontSans.variable,
          fontSerif.variable
        )}
      >
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <span className="font-bold sm:inline-block font-sans text-lg">
                    🏛️ Knowledge Cathedral
                  </span>
                </Link>
                <Link href="/graph" className="transition-colors hover:text-foreground/80 text-foreground/60 font-sans">Graph</Link>
                <Link href="/search" className="transition-colors hover:text-foreground/80 text-foreground/60 font-sans">Search</Link>
              </nav>
              <div className="flex flex-1 items-center justify-end space-x-4">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="flex-1 container max-w-screen-2xl py-8">
            {children}
          </main>
          <footer className="py-6 md:px-8 md:py-0 border-t">
              <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                  <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left font-sans">
                      Built by <a href="#" className="font-medium underline underline-offset-4">Storymorph-C</a>. The source code is available on GitHub.
                  </p>
              </div>
          </footer>
        </div>
      </body>
    </html>
  )
}