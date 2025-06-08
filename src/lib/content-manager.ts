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

export async function getAllNodeSlugs(): Promise<string[]> {
  async function getFiles(dir: string): Promise<string[]> {
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
  }
  
  return getFiles(CONTENT_PATH)
}

export async function getNodeContent(slug: string): Promise<KnowledgeNode | null> {
  try {
    const filePath = path.join(CONTENT_PATH, `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf8')
    
    const { data, content } = matter(fileContent)
    const metadata = {
      title: data.title || slug.split('/').pop() || 'Untitled',
      created: data.created || new Date().toISOString(),
      modified: data.modified || new Date().toISOString(),
      stage: data.stage || 'seed',
      certainty: data.certainty || 0.5,
      importance: data.importance || 3,
      visibility: data.visibility || 'public',
      tags: data.tags || [],
      description: data.description
    } as NodeMetadata
    
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkWikiLink, {
            pageResolver: (name: string) => [name.toLowerCase().replace(/ /g, '-')],
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
    const excerptMatch = content.match(/^(.+?)(\n\n|$)/)
    const excerpt = excerptMatch ? excerptMatch[1] : ''
    
    return {
      slug,
      content: mdxSource,
      metadata,
      backlinks: [],
      readingTime: stats.text,
      excerpt
    }
  } catch (error) {
    console.error(`Error loading node ${slug}:`, error)
    return null
  }
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
  const slugs = await getAllNodeSlugs()
  const nodes = await Promise.all(
    slugs.map(slug => getNodeContent(slug))
  )
  
  const searchTerms = query.toLowerCase().split(' ')
  
  return nodes
    .filter((node): node is KnowledgeNode => {
      if (!node || node.metadata.visibility === 'private') return false
      
      const searchableText = `
        ${node.metadata.title} 
        ${node.metadata.description || ''} 
        ${node.metadata.tags.join(' ')}
        ${node.excerpt}
      `.toLowerCase()
      
      return searchTerms.every(term => searchableText.includes(term))
    })
    .sort((a, b) => b.metadata.importance - a.metadata.importance)
}
