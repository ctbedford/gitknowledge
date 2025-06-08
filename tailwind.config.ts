import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme' // To extend default fonts

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Light Mode
        'primary-light': '#2563eb', // Blue 600
        'secondary-light': '#475569', // Slate 600
        'accent-light': '#059669', // Emerald 600
        'bg-default-light': '#f8fafc', // Slate 50
        'bg-subtle-light': '#f1f5f9', // Slate 100
        'text-default-light': '#1e293b', // Slate 800
        'text-muted-light': '#64748b', // Slate 500
        'border-default-light': '#cbd5e1', // Slate 300

        // Dark Mode
        'primary-dark': '#60a5fa', // Blue 400
        'secondary-dark': '#94a3b8', // Slate 400
        'accent-dark': '#34d399', // Emerald 400
        'bg-default-dark': '#0f172a', // Slate 900
        'bg-subtle-dark': '#1e293b', // Slate 800
        'text-default-dark': '#e2e8f0', // Slate 200
        'text-muted-dark': '#94a3b8', // Slate 400
        'border-default-dark': '#334155', // Slate 700
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Georgia', ...defaultTheme.fontFamily.serif],
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.text-default-light'),
            a: {
              color: theme('colors.primary-light'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            h1: { color: theme('colors.text-default-light') },
            h2: { color: theme('colors.text-default-light') },
            h3: { color: theme('colors.text-default-light') },
            h4: { color: theme('colors.text-default-light') },
            strong: { color: theme('colors.text-default-light') },
            code: {
              color: theme('colors.secondary-light'),
              backgroundColor: theme('colors.bg-subtle-light'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: {
              color: theme('colors.text-muted-light'),
              borderLeftColor: theme('colors.border-default-light'),
              fontStyle: 'italic',
            },
          },
        },
        dark: { // This key is how you provide overrides for the plugin's dark variant
          css: {
            color: theme('colors.text-default-dark'),
            a: {
              color: theme('colors.primary-dark'),
            },
            h1: { color: theme('colors.text-default-dark') },
            h2: { color: theme('colors.text-default-dark') },
            h3: { color: theme('colors.text-default-dark') },
            h4: { color: theme('colors.text-default-dark') },
            strong: { color: theme('colors.text-default-dark') },
            code: {
              color: theme('colors.secondary-dark'),
              backgroundColor: theme('colors.bg-subtle-dark'),
            },
            blockquote: {
              color: theme('colors.text-muted-dark'),
              borderLeftColor: theme('colors.border-default-dark'),
            },
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
