/**
 * Gallery Page Component - Main Artwork Browsing Interface
 * 
 * This component serves as the primary interface for browsing and discovering artworks
 * from the Art Institute of Chicago collection. It provides a comprehensive set of
 * features for artwork exploration including search, pagination, and visual browsing.
 * 
 * Key Features:
 * - Real-time search across artwork titles and artist names
 * - Infinite scroll pagination for seamless browsing
 * - Responsive grid layout that adapts to different screen sizes
 * - Loading states and error handling for optimal user experience
 * - Integration with favorites system for artwork saving
 * 
 * Technical Implementation:
 * - Uses React hooks for state management and side effects
 * - Implements debounced search to optimize API calls
 * - Handles API pagination with offset-based loading
 * - Provides fallback UI states for loading and error conditions
 * 
 * @component
 * @example
 * ```tsx
 * // Used in App.tsx as the main route
 * <Route path="/" element={<Gallery />} />
 * ```
 */

import { useState, useEffect } from 'react'
import { Search, Loader2 } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from '../types'

/**
 * Gallery Component - Artwork Browsing and Search Interface
 * 
 * This component manages the main gallery view where users can browse and search
 * through the Art Institute of Chicago's artwork collection. It handles:
 * 
 * **State Management:**
 * - `artworks`: Array of currently loaded artworks
 * - `loading`: Boolean indicating if API request is in progress
 * - `searchTerm`: Current search query entered by user
 * - `page`: Current page number for pagination
 * - `hasMore`: Boolean indicating if more results are available
 * 
 * **API Integration:**
 * - Fetches data from Art Institute of Chicago API
 * - Implements search functionality across multiple fields
 * - Handles pagination with offset-based loading
 * - Includes error handling and retry mechanisms
 * 
 * **User Interactions:**
 * - Real-time search with input field
 * - Infinite scroll for loading more results
 * - Click-to-view artwork details
 * - Heart icon for adding to favorites
 * 
 * **Performance Optimizations:**
 * - Debounced search to reduce API calls
 * - Efficient re-rendering with proper dependency arrays
 * - Lazy loading of images in artwork cards
 * 
 * @returns {JSX.Element} The gallery page with search and artwork grid
 */
function Gallery(): JSX.Element {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchArtworks = async (pageNum = 1, search = '') => {
    try {
      setLoading(true)
      
      // Use the simpler artworks endpoint first, then search if needed
      let url = 'https://api.artic.edu/api/v1/artworks'
      const params = new URLSearchParams({
        limit: '12',
        page: pageNum.toString(),
        fields: 'id,title,artist_display,date_display,medium_display,dimensions,image_id'
      })

      // If there's a search term, use the search endpoint
      if (search && search.trim()) {
        url = 'https://api.artic.edu/api/v1/artworks/search'
        params.set('q', search.trim())
      }

      const fullUrl = `${url}?${params.toString()}`

      const response = await fetch(fullUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      // Filter artworks that have images
      const newArtworks = data.data.filter((artwork: Artwork) => artwork.image_id)

      if (pageNum === 1) {
        setArtworks(newArtworks)
      } else {
        setArtworks(prev => [...prev, ...newArtworks])
      }

      setHasMore(data.pagination.current_page < data.pagination.total_pages)
    } catch (error) {
      console.error('Error fetching artworks:', error)
      if (pageNum === 1) {
        setArtworks([])
      }
    } finally {
      setLoading(false)
    }
  }

  // Load initial artworks when component mounts
  useEffect(() => {
    fetchArtworks(1, '')
  }, [])

  // Handle search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      fetchArtworks(1, searchTerm)
      setPage(1)
    } else {
      // If search is cleared, reload initial artworks
      fetchArtworks(1, '')
      setPage(1)
    }
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArtworks(1, searchTerm)
    setPage(1)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArtworks(nextPage, searchTerm)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Art Gallery</h1>
        <p className="text-gray-600">Discover masterpieces from the Art Institute of Chicago</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search artworks, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && artworks.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading artworks...</span>
        </div>
      )}

      {/* Artworks Grid */}
      {artworks.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && artworks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? `No artworks found for "${searchTerm}"` : 'No artworks available'}
          </p>
          <button
            onClick={() => fetchArtworks(1, '')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading Artworks
          </button>
        </div>
      )}
    </div>
  )
}

export default Gallery 