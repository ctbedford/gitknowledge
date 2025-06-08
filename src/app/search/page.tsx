import { searchNodes } from '@/lib/content-manager'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata = {
  title: 'Search | Knowledge Cathedral',
  description: 'Search through the cathedral'
}

function getStageEmoji(stage: string) {
  const stages: Record<string, string> = {
    seed: '🌱',
    sapling: '🌿',
    tree: '🌳',
    forest: '🌲'
  }
  return stages[stage] || '🌱'
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const results = query ? await searchNodes(query) : []
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search the Cathedral</h1>
      
      {/* Search form */}
      <form className="mb-8">
        <div className="relative">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search nodes..."
            className="w-full px-4 py-3 pr-12 border dark:border-gray-700 rounded-lg 
                     bg-white dark:bg-gray-800 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     text-lg"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 
                     text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        {/* Quick search tips */}
        {!query && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Try searching for: 
            <button type="submit" name="q" value="seed" 
                    className="ml-2 text-blue-600 hover:underline">seeds</button>,
            <button type="submit" name="q" value="knowledge" 
                    className="ml-1 text-blue-600 hover:underline">knowledge</button>, or
            <button type="submit" name="q" value="digital garden" 
                    className="ml-1 text-blue-600 hover:underline">digital garden</button>
          </div>
        )}
      </form>
      
      {/* Results */}
      {query && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''} for 
              <span className="font-semibold ml-1">"{query}"</span>
            </p>
            
            {results.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by importance
              </div>
            )}
          </div>
          
          {results.length > 0 ? (
            <div className="space-y-6">
              {results.map(node => (
                <article key={node.slug} 
                         className="border dark:border-gray-700 rounded-lg p-6 
                                  hover:shadow-lg dark:hover:shadow-gray-900/50 
                                  transition-all duration-200
                                  bg-white dark:bg-gray-800">
                  <Link href={`/${node.slug}`} className="group">
                    <h2 className="text-xl font-semibold group-hover:text-blue-600 
                                 dark:group-hover:text-blue-400 transition-colors 
                                 flex items-center gap-2 mb-2">
                      <span>{getStageEmoji(node.metadata.stage)}</span>
                      <span dangerouslySetInnerHTML={{ 
                        __html: highlightQuery(node.metadata.title, query) 
                      }} />
                    </h2>
                  </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span>{node.readingTime}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">{'★'.repeat(node.metadata.importance)}</span>
                      <span className="text-gray-300 dark:text-gray-600">
                        {'★'.repeat(5 - node.metadata.importance)}
                      </span>
                    </span>
                    <span>•</span>
                    <span>{Math.round(node.metadata.certainty * 100)}% certain</span>
                    <span>•</span>
                    <time dateTime={node.metadata.modified}>
                      {formatDistanceToNow(new Date(node.metadata.modified))} ago
                    </time>
                  </div>
                  
                  {node.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3"
                       dangerouslySetInnerHTML={{ 
                         __html: highlightQuery(node.excerpt, query) 
                       }} />
                  )}
                  
                  {node.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {node.metadata.tags.map(tag => (
                        <Link
                          key={tag}
                          href={`/tags/${tag}`}
                          className="text-sm px-2 py-1 
                                   bg-gray-100 dark:bg-gray-700 
                                   hover:bg-gray-200 dark:hover:bg-gray-600 
                                   rounded transition-colors"
                        >
                          #{highlightQuery(tag, query)}
                        </Link>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔍</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No nodes found matching your search.
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Try different keywords or browse the{' '}
                <Link href="/graph" className="text-blue-600 dark:text-blue-400 hover:underline">
                  knowledge graph
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Search tips when no query */}
      {!query && (
        <div className="space-y-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-3">Search Tips</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Search matches titles, content, tags, and descriptions
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Use multiple words to narrow results
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Private nodes are excluded from search
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                Results are ranked by importance and relevance
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Browse by Stage</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/search?q=stage:seed" 
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg 
                             hover:bg-green-100 dark:hover:bg-green-900/30 
                             transition-colors text-center">
                <div className="text-3xl mb-2">🌱</div>
                <div className="font-medium">Seeds</div>
              </Link>
              <Link href="/search?q=stage:sapling" 
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg 
                             hover:bg-green-100 dark:hover:bg-green-900/30 
                             transition-colors text-center">
                <div className="text-3xl mb-2">🌿</div>
                <div className="font-medium">Saplings</div>
              </Link>
              <Link href="/search?q=stage:tree" 
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg 
                             hover:bg-green-100 dark:hover:bg-green-900/30 
                             transition-colors text-center">
                <div className="text-3xl mb-2">🌳</div>
                <div className="font-medium">Trees</div>
              </Link>
              <Link href="/search?q=stage:forest" 
                    className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg 
                             hover:bg-green-100 dark:hover:bg-green-900/30 
                             transition-colors text-center">
                <div className="text-3xl mb-2">🌲</div>
                <div className="font-medium">Forests</div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to highlight search terms
function highlightQuery(text: string, query: string): string {
  if (!query) return text
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">$1</mark>')
}