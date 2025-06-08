'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewNodePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    stage: 'seed',
    certainty: 0.5,
    importance: 3,
    visibility: 'public',
    tags: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    setFormData(prev => ({ ...prev, title, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Generate frontmatter
      const frontmatter = `---
title: ${formData.title}
created: ${new Date().toISOString()}
modified: ${new Date().toISOString()}
stage: ${formData.stage}
certainty: ${formData.certainty}
importance: ${formData.importance}
visibility: ${formData.visibility}
tags: [${formData.tags.split(',').map(t => t.trim()).filter(Boolean).join(', ')}]
description: ${formData.description}
---`

      const fullContent = `${frontmatter}\n\n# ${formData.title}\n\n${formData.content}`

      // In a real implementation, this would call an API endpoint
      // For now, we'll show the content that would be saved
      console.log('Would save:', { slug: formData.slug, content: fullContent })
      
      // Simulate success and redirect
      alert('Node created! (In production, this would save to your content directory)')
      router.push(`/${formData.slug}`)
    } catch (err) {
      setError('Failed to create node. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Plant a New Seed</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                        text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Title and Slug */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My New Thought"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-2">
              URL Slug *
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border 
                           border-r-0 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
                           text-gray-500 text-sm">
                /
              </span>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                required
                className="flex-1 px-3 py-2 border dark:border-gray-700 rounded-r-lg
                         bg-white dark:bg-gray-800
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="my-new-thought"
              />
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A brief description for search and previews"
          />
        </div>
        
        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Content *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            required
            rows={12}
            className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                     bg-white dark:bg-gray-800
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     font-mono text-sm"
            placeholder="Start writing your thoughts...&#10;&#10;You can use [[wiki links]] to connect to other nodes."
          />
          <p className="mt-1 text-sm text-gray-500">
            Supports Markdown and [[wiki-style links]]
          </p>
        </div>
        
        {/* Metadata */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-medium mb-2">
              Growth Stage
            </label>
            <select
              id="stage"
              value={formData.stage}
              onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="seed">🌱 Seed</option>
              <option value="sapling">🌿 Sapling</option>
              <option value="tree">🌳 Tree</option>
              <option value="forest">🌲 Forest</option>
            </select>
          </div>
          
          {/* Certainty */}
          <div>
            <label htmlFor="certainty" className="block text-sm font-medium mb-2">
              Certainty: {Math.round(formData.certainty * 100)}%
            </label>
            <input
              type="range"
              id="certainty"
              min="0"
              max="1"
              step="0.1"
              value={formData.certainty}
              onChange={(e) => setFormData(prev => ({ ...prev, certainty: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>
          
          {/* Importance */}
          <div>
            <label htmlFor="importance" className="block text-sm font-medium mb-2">
              Importance: {'★'.repeat(formData.importance)}{'☆'.repeat(5 - formData.importance)}
            </label>
            <input
              type="range"
              id="importance"
              min="1"
              max="5"
              step="1"
              value={formData.importance}
              onChange={(e) => setFormData(prev => ({ ...prev, importance: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Tags and Visibility */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="comma, separated, tags"
            />
          </div>
          
          <div>
            <label htmlFor="visibility" className="block text-sm font-medium mb-2">
              Visibility
            </label>
            <select
              id="visibility"
              value={formData.visibility}
              onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:opacity-50 
                     transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Node'}
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                     transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
      
      {/* Help text */}
      <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold mb-3">Writing Tips</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Use [[double brackets]] to create wiki-style links to other nodes</li>
          <li>• Start with a seed and let it grow naturally over time</li>
          <li>• Lower certainty for ideas you're still exploring</li>
          <li>• Use tags to create topic clusters</li>
          <li>• Private nodes are only visible to you</li>
        </ul>
      </div>
    </div>
  )
}