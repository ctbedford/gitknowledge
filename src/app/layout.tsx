import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle' // Import ThemeToggle

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className="">
      <body 
        className={`${inter.className} min-h-screen font-sans bg-bg-default-light text-text-default-light dark:bg-bg-default-dark dark:text-text-default-dark`}
      >
        <nav className="bg-bg-subtle-light dark:bg-bg-subtle-dark shadow-sm border-b border-border-default-light dark:border-border-default-dark sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold text-text-default-light dark:text-text-default-dark">
                  🏛️ Knowledge Cathedral
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/now" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                    Now
                  </Link>
                  <Link href="/evergreen" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                    Evergreen
                  </Link>
                  <Link href="/graph" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                    Graph
                  </Link>
                  <Link href="/search" className="text-text-muted-light dark:text-text-muted-dark hover:text-primary-light dark:hover:text-primary-dark transition-colors">
                    Search
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  href="/new" 
                  className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90 transition-opacity"
                >
                  + New Node
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto p-4 prose dark:prose-dark lg:prose-xl">
          {children}
        </main>
        <ThemeToggle />
      </body>
    </html>
  )
}
