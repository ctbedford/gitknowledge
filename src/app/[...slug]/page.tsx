import { MDXRemote } from 'next-mdx-remote'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getNodeContent, getAllNodeSlugs } from '@/lib/content-manager'
import { formatDistanceToNow } from 'date-fns'

export async function generateStaticParams() {
  const slugs = await getAllNodeSlugs()
  
  return slugs.map((slug) => ({
    slug: slug.split('/')
  }))
}

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const node = await getNodeContent(slug)
  
  if (!node) return { title: 'Not Found' }
  
  return {
    title: `${node.metadata.title} | Knowledge Cathedral`,
    description: node.metadata.description || node.excerpt,
  }
}

function StageIndicator({ stage }: { stage: string }) {
  const stageConfig = {
    seed: { emoji: '🌱', color: 'text-green-500' },
    sapling: { emoji: '🌿', color: 'text-green-600' },
    tree: { emoji: '🌳', color: 'text-green-700' },
    forest: { emoji: '🌲', color: 'text-green-800' }
  }
  
  const config = stageConfig[stage as keyof typeof stageConfig] || stageConfig.seed
  
  return (
    <span className={`${config.color} text-xl`} title={`Stage: ${stage}`}>
      {config.emoji}
    </span>
  )
}

function CertaintyMeter({ certainty }: { certainty: number }) {
  const percentage = Math.round(certainty * 100)
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Certainty:</span>
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm text-gray-600">{percentage}%</span>
    </div>
  )
}

export default async function NodePage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const node = await getNodeContent(slug)
  
  if (!node) {
    notFound()
  }
  
  if (node.metadata.visibility === 'private') {
    notFound()
  }
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <StageIndicator stage={node.metadata.stage} />
          <h1 className="text-4xl font-bold">{node.metadata.title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          <span>{node.readingTime}</span>
          <span>•</span>
          <time dateTime={node.metadata.modified}>
            Updated {formatDistanceToNow(new Date(node.metadata.modified))} ago
          </time>
          <span>•</span>
          <CertaintyMeter certainty={node.metadata.certainty} />
        </div>
        
        {node.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {node.metadata.tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </header>
      
      <div className="prose prose-lg max-w-none mb-12">
        <MDXRemote {...node.content} />
      </div>
    </article>
  )
}
