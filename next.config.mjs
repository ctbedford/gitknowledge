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
  images: {
    // Add any external image domains you want to support
    domains: [],
    // Support for image optimization
    formats: ['image/avif', 'image/webp'],
  },
  // Ensure trailing slashes are handled consistently
  trailingSlash: false,
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Headers for better security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Redirects for common patterns
  async redirects() {
    return [
      // Redirect /index to home
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Add any other redirects you need
    ]
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkGfm,
      [remarkWikiLink, {
        pageResolver: (name) => {
          // Handle different wiki link formats
          return [name.toLowerCase().replace(/\s+/g, '-')]
        },
        hrefTemplate: (permalink) => {
          // Ensure proper URL formatting
          return `/${permalink}`
        }
      }]
    ],
    rehypePlugins: [
      rehypeHighlight,
      rehypeSlug,
      [rehypeAutolinkHeadings, { 
        behavior: 'wrap',
        properties: {
          className: ['anchor']
        }
      }]
    ],
  },
})

export default withMDX(nextConfig)