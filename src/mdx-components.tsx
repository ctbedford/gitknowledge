import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      if (href?.startsWith('#')) {
        return <a href={href} {...props}>{children}</a>
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      )
    },
    img: ({ src, alt, ...props }) => {
      if (!src) return null
      return (
        <Image
          src={src}
          alt={alt || ''}
          width={800}
          height={600}
          style={{ maxWidth: '100%', height: 'auto' }}
          {...props}
        />
      )
    },
  }
}
