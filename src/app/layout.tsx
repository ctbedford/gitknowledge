import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

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
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-xl font-bold">
                  🏛️ Knowledge Cathedral
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/now" className="hover:text-blue-600 transition-colors">
                    Now
                  </Link>
                  <Link href="/evergreen" className="hover:text-blue-600 transition-colors">
                    Evergreen
                  </Link>
                  <Link href="/graph" className="hover:text-blue-600 transition-colors">
                    Graph
                  </Link>
                  <Link href="/search" className="hover:text-blue-600 transition-colors">
                    Search
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  href="/new" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  + New Node
                </Link>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  )
}
