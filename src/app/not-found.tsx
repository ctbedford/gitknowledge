import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center">
        <div className="text-8xl mb-8">🏚️</div>
        <h1 className="text-4xl font-bold mb-4">Lost in the Cathedral</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          This chamber hasn't been built yet, or perhaps it's hidden from view.
        </p>
        
        <div className="space-y-4">
          <p className="text-gray-500">
            The node you're looking for might have been moved, renamed, or set to private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
            
            <Link
              href="/search"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                       transition-colors"
            >
              Search Cathedral
            </Link>
            
            <Link
              href="/graph"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 
                       rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 
                       transition-colors"
            >
              Explore Graph
            </Link>
          </div>
        </div>
        
        <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Lost? Try these popular nodes:</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <Link href="/now" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌊</span>
                <div>
                  <div className="font-medium">Now</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current focus</div>
                </div>
              </div>
            </Link>
            
            <Link href="/evergreen" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌲</span>
                <div>
                  <div className="font-medium">Evergreen</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Timeless ideas</div>
                </div>
              </div>
            </Link>
            
            <Link href="/meta/about" className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="font-medium">About</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Learn more</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}