'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Cathedral error:', error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-8xl mb-8">🏗️</div>
        <h1 className="text-4xl font-bold mb-4">Under Construction</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong while building this part of the cathedral.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
          <h2 className="font-semibold mb-2">Error Details:</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-2">
              Error ID: {error.digest}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          
          <Link
            href="/"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                     transition-colors"
          >
            Return Home
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>If this error persists, please check:</p>
          <ul className="mt-2 space-y-1">
            <li>• Your content files are properly formatted</li>
            <li>• All required metadata fields are present</li>
            <li>• File paths don't contain special characters</li>
          </ul>
        </div>
      </div>
    </div>
  )
}