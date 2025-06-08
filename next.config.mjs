import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkWikiLink from 'remark-wiki-link'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      [remarkWikiLink, {
        pageResolver: (name) => [name.toLowerCase().replace(/ /g, '-')],
        hrefTemplate: (permalink) => `/${permalink}`
      }]
    ],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }]
    ],
  },
})

export default withMDX(nextConfig)
