import Link from 'next/link'
import { getRecentNodes, getNodeStats } from '@/lib/content-manager'
import TimeAgo from '@/components/TimeAgo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

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
  const recentNodes = await getRecentNodes(5)
  const stats = await getNodeStats()
  
  return (
    <div className="space-y-12 font-sans">
      <header className="text-center py-8">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">Knowledge Cathedral</h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          A living repository where thoughts evolve from seeds to forests.
        </p>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Explore Connections</CardTitle>
            <CardDescription>Visualize the web of knowledge.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/graph" className="flex items-center justify-between text-primary hover:underline">
              <span>View the Graph</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Search the Archives</CardTitle>
            <CardDescription>Find any thought instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/search" className="flex items-center justify-between text-primary hover:underline">
              <span>Go to Search</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-sans">Cathedral Statistics</CardTitle>
            <CardDescription>A glance at the repository's health.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Total Nodes:</span>
              <span className="font-bold">{stats.total}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-text-muted">Avg. Importance:</span>
              <span className="font-bold">{stats.avgImportance.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <section>
        <h2 className="text-3xl font-bold font-sans mb-6">Recent Growth</h2>
        <div className="space-y-4">
          {recentNodes.map(node => (
            <Card key={node.slug} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <Link href={`/${node.slug}`}>
                  <CardTitle className="font-sans text-xl flex items-center gap-2 hover:text-primary">
                    <span>{getStageEmoji(node.metadata.stage)}</span>
                    {node.metadata.title}
                  </CardTitle>
                </Link>
                <CardDescription className="flex items-center gap-2 text-xs pt-2">
                  <span>{node.metadata.stage}</span>
                  <span>•</span>
                  <TimeAgo dateString={node.metadata.modified} />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-muted font-serif leading-relaxed">{node.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}