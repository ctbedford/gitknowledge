import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import { Lora, Inter } from 'next/font/google'

// Font setup
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
    <html lang="en" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-bg-default text-text-default">
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 w-full border-b bg-bg-default/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="font-sans text-xl font-bold">
                    🏛️ The Cathedral
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <nav className="hidden md:flex items-center gap-6 text-sm font-medium font-sans">
                    <Link href="/graph" className="text-text-muted hover:text-primary transition-colors">Graph</Link>
                    <Link href="/search" className="text-text-muted hover:text-primary transition-colors">Search</Link>
                  </nav>
                  <div className="w-px h-6 bg-border-default hidden md:block"></div>
                  <ThemeToggle />
                  <Link 
                    href="/new" 
                    className="font-sans px-3 py-1.5 bg-primary text-white rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
                  >
                    New Entry
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* Main Content Area */}
              <main className="lg:col-span-9 py-8">
                <article className="prose dark:prose-invert max-w-none prose-lg">
                  {children}
                </article>
              </main>

              {/* Sidebar Area (for future use) */}
              <aside className="hidden lg:block lg:col-span-3 py-8">
                <div className="sticky top-20 space-y-6">
                  {/* Placeholder for Table of Contents, Related Links etc. */}
                  <div className="p-4 bg-bg-subtle rounded-lg">
                    <h3 className="font-sans font-semibold text-text-default">Context</h3>
                    <p className="font-serif text-sm text-text-muted mt-2">
                      This sidebar will hold navigation, a table of contents, and related notes in a future phase.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          
          <footer className="w-full mt-16 py-8 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-muted text-sm font-sans">
              <p>A Knowledge Cathedral. Built with STORYMORPH-C.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}