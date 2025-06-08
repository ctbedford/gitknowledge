import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': 'rgb(var(--color-primary) / <alpha-value>)',
        'accent': 'rgb(var(--color-accent) / <alpha-value>)',
        'bg-default': 'rgb(var(--color-bg-default) / <alpha-value>)',
        'bg-subtle': 'rgb(var(--color-bg-subtle) / <alpha-value>)',
        'text-default': 'rgb(var(--color-text-default) / <alpha-value>)',
        'text-muted': 'rgb(var(--color-text-muted) / <alpha-value>)',
        'border-default': 'rgb(var(--color-border-default) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--font-serif)', ...defaultTheme.fontFamily.serif],
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text-default'),
            '--tw-prose-headings': theme('colors.text-default'),
            '--tw-prose-links': theme('colors.primary'),
            '--tw-prose-bold': theme('colors.text-default'),
            '--tw-prose-quotes': theme('colors.text-default'),
            '--tw-prose-code': theme('colors.text-default'),
            '--tw-prose-pre-bg': theme('colors.bg-subtle'),
            '--tw-prose-hr': theme('colors.border-default'),
            // Dark mode handled by CSS variables in globals.css
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config