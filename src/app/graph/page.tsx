import { getAllNodeSlugs, getNodeContent } from '@/lib/content-manager'
import { buildBacklinkMap } from '@/lib/backlinks'
import KnowledgeGraph from '@/components/KnowledgeGraph'

export const metadata = {
  title: 'Knowledge Graph | Knowledge Cathedral',
  description: 'Explore the interconnected web of ideas'
}

export default async function GraphPage() {
  // Get all nodes
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(async (slug) => {
      const node = await getNodeContent(slug)
      return node ? {
        id: slug,
        title: node.metadata.title,
        stage: node.metadata.stage,
        importance: node.metadata.importance,
        certainty: node.metadata.certainty,
        visibility: node.metadata.visibility
      } : null
    })
  )
  
  // Filter out private nodes and nulls
  const publicNodes = nodes.filter(
    (node): node is NonNullable<typeof node> => 
      node !== null && node.visibility !== 'private'
  )
  
  // Build links from backlink map
  const backlinkMap = await buildBacklinkMap()
  const links: any[] = []
  const linkSet = new Set<string>()
  
  // Create links from backlink data
  Object.entries(backlinkMap).forEach(([target, sources]) => {
    sources.forEach(source => {
      // Only include links between public nodes
      const sourceNode = publicNodes.find(n => n.id === source)
      const targetNode = publicNodes.find(n => n.id === target)
      
      if (sourceNode && targetNode) {
        const linkId = [source, target].sort().join('-')
        
        if (!linkSet.has(linkId)) {
          linkSet.add(linkId)
          
          // Check if bidirectional
          const isBidirectional = backlinkMap[source]?.includes(target)
          
          links.push({
            source,
            target,
            bidirectional: isBidirectional
          })
        }
      }
    })
  })
  
  // Calculate graph statistics
  const stats = {
    totalNodes: publicNodes.length,
    totalLinks: links.length,
    bidirectionalLinks: links.filter(l => l.bidirectional).length,
    orphanNodes: publicNodes.filter(node => 
      !links.some(link => link.source === node.id || link.target === node.id)
    ).length,
    averageConnections: links.length > 0 
      ? (links.length * 2 / publicNodes.length).toFixed(1) 
      : '0',
    stageDistribution: {
      seed: publicNodes.filter(n => n.stage === 'seed').length,
      sapling: publicNodes.filter(n => n.stage === 'sapling').length,
      tree: publicNodes.filter(n => n.stage === 'tree').length,
      forest: publicNodes.filter(n => n.stage === 'forest').length
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Knowledge Graph</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore the cathedral's architecture. Each node is an idea, each line a connection.
          The size represents importance, the opacity shows certainty.
        </p>
      </header>
      
      {/* Graph visualization */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 mb-8">
        <div className="h-[600px]">
          <KnowledgeGraph nodes={publicNodes} links={links} />
        </div>
      </div>
      
      {/* Statistics and info */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Graph Statistics */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Graph Statistics
          </h2>
          <dl className="space-y-3">
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Total Nodes:</dt>
              <dd className="font-semibold text-lg">{stats.totalNodes}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Total Connections:</dt>
              <dd className="font-semibold text-lg">{stats.totalLinks}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Bidirectional Links:</dt>
              <dd className="font-semibold text-lg text-green-600">
                {stats.bidirectionalLinks}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Orphan Nodes:</dt>
              <dd className="font-semibold text-lg text-gray-500">
                {stats.orphanNodes}
              </dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-gray-600 dark:text-gray-400">Avg. Connections:</dt>
              <dd className="font-semibold text-lg">{stats.averageConnections}</dd>
            </div>
          </dl>
        </div>
        
        {/* Stage Distribution */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🌱</span> Growth Distribution
          </h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2">
                  <span className="text-green-500">🌱</span> Seeds
                </span>
                <span className="font-semibold">{stats.stageDistribution.seed}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(stats.stageDistribution.seed / stats.totalNodes * 100) || 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2">
                  <span className="text-green-600">🌿</span> Saplings
                </span>
                <span className="font-semibold">{stats.stageDistribution.sapling}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(stats.stageDistribution.sapling / stats.totalNodes * 100) || 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2">
                  <span className="text-green-700">🌳</span> Trees
                </span>
                <span className="font-semibold">{stats.stageDistribution.tree}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-700 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(stats.stageDistribution.tree / stats.totalNodes * 100) || 0}%` 
                  }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-2">
                  <span className="text-green-900">🌲</span> Forests
                </span>
                <span className="font-semibold">{stats.stageDistribution.forest}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-900 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(stats.stageDistribution.forest / stats.totalNodes * 100) || 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tips */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">🧭</span> Navigation Tips
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Zoom: Scroll or pinch</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Pan: Click and drag background</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Rearrange: Drag nodes</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Visit: Click any node</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Hover to highlight connections</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span>Size = importance, opacity = certainty</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Most connected nodes */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-2xl">🏆</span> Most Connected Nodes
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publicNodes
            .map(node => ({
              ...node,
              connectionCount: links.filter(l => 
                l.source === node.id || l.target === node.id
              ).length
            }))
            .sort((a, b) => b.connectionCount - a.connectionCount)
            .slice(0, 6)
            .map(node => (
              <a
                key={node.id}
                href={`/${node.id}`}
                className="flex items-center justify-between p-3 
                         bg-white dark:bg-gray-700 rounded-lg 
                         hover:shadow-md dark:hover:shadow-gray-900/50 
                         transition-all duration-200"
              >
                <span className="font-medium">{node.title}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {node.connectionCount} links
                </span>
              </a>
            ))}
        </div>
      </div>
    </div>
  )
}