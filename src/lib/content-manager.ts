import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import readingTime from 'reading-time'

const CONTENT_PATH = path.join(process.cwd(), 'content')

export interface NodeMetadata {
  title: string
  created: string
  modified: string
  stage: 'seed' | 'sapling' | 'tree' | 'forest'
  certainty: number
  importance: number
  visibility: 'private' | 'unlisted' | 'public'
  tags: string[]
  description?: string
}

export interface KnowledgeNode {
  slug: string
  content: any
  metadata: NodeMetadata
  backlinks: string[]
  readingTime: string
  excerpt: string
}

// Check if content directory exists
async function ensureContentDirectory() {
  try {
    await fs.access(CONTENT_PATH)
  } catch {
    console.warn(`Content directory not found at ${CONTENT_PATH}`)
    return false
  }
  return true
}

export async function getAllNodeSlugs(): Promise<string[]> {
  if (!await ensureContentDirectory()) return []
  
  async function getFiles(dir: string): Promise<string[]> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      const files = await Promise.all(
        entries.map(async (entry) => {
          const fullPath = path.join(dir, entry.name)
          if (entry.isDirectory()) {
            return getFiles(fullPath)
          } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            const relativePath = path.relative(CONTENT_PATH, fullPath)
            return relativePath.replace(/\.(md|mdx)$/, '')
          }
          return []
        })
      )
      return files.flat()
    } catch (error) {
      console.error(`Error reading directory ${dir}:`, error)
      return []
    }
  }
  
  return getFiles(CONTENT_PATH)
}

export async function getNodeContent(slug: string): Promise<KnowledgeNode | null> {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    const { data, content } = matter(fileContent)
    const metadata = {
      title: data.title || slug.split('/').pop()?.replace(/-/g, ' ') || 'Untitled',
      created: data.created || new Date().toISOString(),
      modified: data.modified || new Date().toISOString(),
      stage: data.stage || 'seed',
      certainty: typeof data.certainty === 'number' ? data.certainty : 0.5,
      importance: typeof data.importance === 'number' ? data.importance : 3,
      visibility: data.visibility || 'public',
      tags: Array.isArray(data.tags) ? data.tags : [],
      description: data.description
    } as NodeMetadata
    
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkWikiLink, {
            pageResolver: (name: string) => [name.toLowerCase().replace(/\s+/g, '-')],
            hrefTemplate: (permalink: string) => `/${permalink}`
          }]
        ],
        rehypePlugins: [
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]
      }
    })
    
    const stats = readingTime(content)
    
    // Extract excerpt - first paragraph or first 160 chars
    const excerptMatch = content.match(/^(.+?)(\n\n|$)/)
    const excerpt = excerptMatch 
      ? excerptMatch[1].replace(/^#+\s+/, '').substring(0, 160) 
      : content.substring(0, 160)
    
    return {
      slug,
      content: mdxSource,
      metadata,
      backlinks: [],
      readingTime: stats.text,
      excerpt: excerpt.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    }
  } catch (error) {
    console.error(`Error loading node ${slug}:`, error)
    return null
  }
}

export async function getNodesByTag(tag: string): Promise<KnowledgeNode[]> {
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  return nodes
    .filter((node): node is KnowledgeNode => 
      node !== null && 
      node.metadata.visibility === 'public' &&
      node.metadata.tags.includes(tag)
    )
    .sort((a, b) => 
      new Date(b.metadata.modified).getTime() - 
      new Date(a.metadata.modified).getTime()
    )
}

export async function getNodesByStage(stage: string): Promise<KnowledgeNode[]> {
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  return nodes
    .filter((node): node is KnowledgeNode => 
      node !== null && 
      node.metadata.visibility === 'public' &&
      node.metadata.stage === stage
    )
    .sort((a, b) => 
      new Date(b.metadata.modified).getTime() - 
      new Date(a.metadata.modified).getTime()
    )
}

export async function getRecentNodes(limit: number = 10): Promise<KnowledgeNode[]> {
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  return nodes
    .filter((node): node is KnowledgeNode => 
      node !== null && node.metadata.visibility === 'public'
    )
    .sort((a, b) => 
      new Date(b.metadata.modified).getTime() - 
      new Date(a.metadata.modified).getTime()
    )
    .slice(0, limit)
}

export async function searchNodes(query: string): Promise<KnowledgeNode[]> {
  // Check for special search operators
  if (query.startsWith('stage:')) {
    const stage = query.replace('stage:', '').trim()
    return getNodesByStage(stage)
  }
  
  if (query.startsWith('tag:')) {
    const tag = query.replace('tag:', '').trim()
    return getNodesByTag(tag)
  }
  
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  const searchTerms = query.toLowerCase().split(' ').filter(Boolean)
  
  return nodes
    .filter((node): node is KnowledgeNode => {
      if (!node || node.metadata.visibility === 'private') return false
      
      const searchableText = `
        ${node.metadata.title} 
        ${node.metadata.description || ''} 
        ${node.metadata.tags.join(' ')}
        ${node.excerpt}
        ${node.metadata.stage}
      `.toLowerCase()
      
      return searchTerms.every(term => searchableText.includes(term))
    })
    .sort((a, b) => {
      // Sort by relevance (how many terms match in title)
      const aMatches = searchTerms.filter(term => 
        a.metadata.title.toLowerCase().includes(term)
      ).length
      const bMatches = searchTerms.filter(term => 
        b.metadata.title.toLowerCase().includes(term)
      ).length
      
      if (aMatches !== bMatches) return bMatches - aMatches
      
      // Then by importance
      return b.metadata.importance - a.metadata.importance
    })
}

// Get node count statistics
export async function getNodeStats() {
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  const publicNodes = nodes.filter(node => 
    node !== null && node.metadata.visibility === 'public'
  ) as KnowledgeNode[]
  
  return {
    total: publicNodes.length,
    byStage: {
      seed: publicNodes.filter(n => n.metadata.stage === 'seed').length,
      sapling: publicNodes.filter(n => n.metadata.stage === 'sapling').length,
      tree: publicNodes.filter(n => n.metadata.stage === 'tree').length,
      forest: publicNodes.filter(n => n.metadata.stage === 'forest').length
    },
    avgCertainty: publicNodes.reduce((sum, n) => sum + n.metadata.certainty, 0) / publicNodes.length || 0,
    avgImportance: publicNodes.reduce((sum, n) => sum + n.metadata.importance, 0) / publicNodes.length || 0
  }
}