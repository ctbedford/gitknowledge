'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('system')

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'system'
    setTheme(storedTheme)
  }, [])

  useEffect(() => {
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-md text-text-muted dark:text-dark-text-muted hover:bg-bg-subtle dark:hover:bg-dark-bg-subtle transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' && '☀️'}
      {theme === 'dark' && '🌙'}
      {theme === 'system' && '🖥️'}
    </button>
  )
}