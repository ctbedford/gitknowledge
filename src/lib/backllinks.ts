import { getAllNodeSlugs, getNodeContent } from './content-manager'
import path from 'path'
import fs from 'fs/promises'
import matter from 'gray-matter'

export interface BacklinkMap {
  [slug: string]: string[]
}

export interface NodeConnections {
  backlinks: string[]
  forwardLinks: string[]
  bidirectional: string[]
}

// Extract all types of links from content
function extractLinks(content: string, currentSlug: string): string[] {
  const links = new Set<string>()
  
  // Wiki-style links: [[Page Name]] or [[page-name]]
  const wikiLinkRegex = /\[\[([^\]]+)\]\]/g
  let match
  while ((match = wikiLinkRegex.exec(content)) !== null) {
    const pageName = match[1]
    // Handle both "Page Name" and "page-name" formats
    const slug = pageName.toLowerCase().replace(/\s+/g, '-')
    links.add(slug)
  }
  
  // Markdown links: [text](/path/to/page)
  const mdLinkRegex = /\[([^\]]+)\]\(\/([^)]+)\)/g
  while ((match = mdLinkRegex.exec(content)) !== null) {
    const linkPath = match[2]
    // Remove anchors, query params, and .md extensions
    const slug = linkPath
      .split('#')[0]
      .split('?')[0]
      .replace(/\.mdx?$/, '')
    
    if (slug && !slug.startsWith('http')) {
      links.add(slug)
    }
  }
  
  // Remove self-references
  links.delete(currentSlug)
  
  return Array.from(links)
}

// Build complete backlink map for all nodes
export async function buildBacklinkMap(): Promise<BacklinkMap> {
  const slugs = await getAllNodeSlugs()
  const backlinkMap: BacklinkMap = {}
  
  // Initialize empty arrays for all slugs
  slugs.forEach(slug => {
    backlinkMap[slug] = []
  })
  
  // Process each node
  for (const slug of slugs) {
    try {
      const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
      const fileContent = await fs.readFile(filePath, 'utf8')
      const { content } = matter(fileContent)
      
      // Extract all links from this node
      const links = extractLinks(content, slug)
      
      // Add this node as a backlink to all linked nodes
      links.forEach(linkedSlug => {
        // Handle nested paths properly
        if (backlinkMap[linkedSlug]) {
          backlinkMap[linkedSlug].push(slug)
        } else {
          // Create entry for linked slugs that might not exist yet
          backlinkMap[linkedSlug] = [slug]
        }
      })
    } catch (error) {
      console.error(`Error processing backlinks for ${slug}:`, error)
    }
  }
  
  // Remove duplicates and sort
  Object.keys(backlinkMap).forEach(slug => {
    backlinkMap[slug] = [...new Set(backlinkMap[slug])].sort()
  })
  
  return backlinkMap
}

// Get backlinks for a specific node
export async function getBacklinksForNode(slug: string): Promise<string[]> {
  const backlinkMap = await buildBacklinkMap()
  return backlinkMap[slug] || []
}

// Get forward links from a node
export async function getForwardLinks(slug: string): Promise<string[]> {
  try {
    const filePath = path.join(process.cwd(), 'content', `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    const { content } = matter(fileContent)
    return extractLinks(content, slug)
  } catch (error) {
    console.error(`Error getting forward links for ${slug}:`, error)
    return []
  }
}

// Get complete node connections
export async function getNodeConnections(slug: string): Promise<NodeConnections> {
  const [backlinks, forwardLinks] = await Promise.all([
    getBacklinksForNode(slug),
    getForwardLinks(slug)
  ])
  
  // Find bidirectional connections
  const bidirectional = backlinks.filter(backlink => 
    forwardLinks.includes(backlink)
  )
  
  return {
    backlinks,
    forwardLinks,
    bidirectional
  }
}

// Get related nodes based on shared links
export async function getRelatedNodes(slug: string, limit: number = 5): Promise<string[]> {
  const connections = await getNodeConnections(slug)
  const allConnected = [...connections.backlinks, ...connections.forwardLinks]
  
  // Count how many connections each connected node shares
  const sharedConnections: Record<string, number> = {}
  
  for (const connectedSlug of allConnected) {
    const theirConnections = await getNodeConnections(connectedSlug)
    const theirAll = [...theirConnections.backlinks, ...theirConnections.forwardLinks]
    
    // Count shared connections
    const shared = allConnected.filter(s => theirAll.includes(s))
    if (shared.length > 0) {
      sharedConnections[connectedSlug] = shared.length
    }
  }
  
  // Sort by most shared connections
  return Object.entries(sharedConnections)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([slug]) => slug)
}