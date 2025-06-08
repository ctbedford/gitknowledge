import Link from 'next/link'
import { getRecentNodes } from '@/lib/content-manager'
import { formatDistanceToNow } from 'date-fns'

function getStageEmoji(stage: string) {
  const stages: Record<string, string> = {
    seed: '🌱',
    sapling: '🌿', 
    tree: '🌳',
    forest: '🌲'
  }
  return stages[stage] || '🌱'
}

export default async function HomePage() {
  const recentNodes = await getRecentNodes(10)
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Knowledge Cathedral</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A living repository where thoughts evolve from seeds to forests.
          Every idea has a home, every connection tells a story.
        </p>
      </header>
      
      <div className="mb-12">
        <form action="/search" method="get" className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search the cathedral..."
              className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link href="/now" className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">🌊 Now</h2>
          <p className="text-gray-700">Current focus, active projects, and thoughts in motion</p>
        </Link>
        
        <Link href="/evergreen" className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">🌲 Evergreen</h2>
          <p className="text-gray-700">Timeless ideas that have grown to maturity</p>
        </Link>
        
        <Link href="/graph" className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
          <h2 className="text-2xl font-semibold mb-2">🕸️ Graph</h2>
          <p className="text-gray-700">Explore the connection map of all knowledge</p>
        </Link>
      </div>
      
      <section>
        <h2 className="text-3xl font-semibold mb-6">Recent Growth</h2>
        <div className="space-y-4">
          {recentNodes.map(node => (
            <article key={node.slug} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <Link href={`/${node.slug}`} className="group">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    <span>{getStageEmoji(node.metadata.stage)}</span>
                    {node.metadata.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {Math.round(node.metadata.certainty * 100)}% certain
                  </span>
                  <span>•</span>
                  <time dateTime={node.metadata.modified}>
                    {formatDistanceToNow(new Date(node.metadata.modified))} ago
                  </time>
                </div>
              </div>
              
              {node.excerpt && (
                <p className="text-gray-600 mb-3">{node.excerpt}</p>
              )}
              
              {node.metadata.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {node.metadata.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
      
      <footer className="mt-16 pt-8 border-t text-center text-gray-600">
        <p className="text-sm">
          Built with STORYMORPH-C • <Link href="/meta/about" className="underline">About this cathedral</Link>
        </p>
      </footer>
    </div>
  )
}
