import { searchNodes } from '@/lib/content-manager'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Search | Knowledge Cathedral',
  description: 'Search through the cathedral'
}

function getStageEmoji(stage: string) {
  const stages: Record<string, string> = { seed: '🌱', sapling: '🌿', tree: '🌳', forest: '🌲' }
  return stages[stage] || '🌱'
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const results = query ? await searchNodes(query) : []
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold mb-8">Search the Cathedral</h1>
      
      <form className="mb-8">
        <div className="relative">
          <Input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search for nodes, tags, or stages (e.g., 'stage:seed')..."
            className="w-full text-lg pr-24"
            autoFocus
          />
          <Button type="submit" className="absolute right-1 top-1 h-9">
            Search
          </Button>
        </div>
      </form>
      
      {query && (
        <div>
          <h2 className="text-lg font-medium mb-6">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </h2>
          
          <div className="space-y-6">
            {results.map(node => (
              <Card key={node.slug} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <Link href={`/${node.slug}`}>
                    <CardTitle className="hover:text-primary flex items-center gap-2">
                      <span>{getStageEmoji(node.metadata.stage)}</span>
                      {node.metadata.title}
                    </CardTitle>
                  </Link>
                  <CardDescription>
                    Last updated {formatDistanceToNow(new Date(node.metadata.modified))} ago • {node.readingTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-serif text-text-muted">{node.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}