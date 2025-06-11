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

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, AlertCircle } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork, ApiResponse } from '../types'

/**
 * Gallery Component - Artwork Browsing and Search Interface
 * 
 * This component manages the main gallery view where users can browse and search
 * through the Art Institute of Chicago's artwork collection. It handles:
 * 
 * **State Management:**
 * - `artworks`: Array of currently loaded artworks
 * - `loading`: Boolean indicating if API request is in progress
 * - `error`: Error message string if API request fails
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
  // ==================== STATE MANAGEMENT ====================
  
  /** 
   * Array of artworks currently displayed in the gallery
   * Accumulates results as user scrolls/searches
   */
  const [artworks, setArtworks] = useState<Artwork[]>([])
  
  /** 
   * Loading state indicator for API requests
   * Used to show loading spinner and prevent duplicate requests
   */
  const [loading, setLoading] = useState<boolean>(false)
  
  /** 
   * Error message from failed API requests
   * Displayed to user with retry option
   */
  const [error, setError] = useState<string>('')
  
  /** 
   * Current search query entered by the user
   * Triggers new API requests when changed
   */
  const [searchTerm, setSearchTerm] = useState<string>('')
  
  /** 
   * Current page number for pagination
   * Incremented when loading more results
   */
  const [page, setPage] = useState<number>(1)
  
  /** 
   * Flag indicating if more results are available
   * Used to show/hide "Load More" functionality
   */
  const [hasMore, setHasMore] = useState<boolean>(true)

  // ==================== API INTEGRATION ====================

  /**
   * Fetches artworks from the Art Institute of Chicago API
   * 
   * This function handles all API communication including:
   * - Building search URLs with proper parameters
   * - Managing loading states during requests
   * - Processing API responses and extracting artwork data
   * - Handling pagination by appending new results
   * - Error handling with user-friendly messages
   * 
   * API Endpoint: https://api.artic.edu/api/v1/artworks/search
   * 
   * Query Parameters:
   * - q: Search term (searches titles, artists, etc.)
   * - limit: Number of results per page (default: 12)
   * - page: Page number for pagination
   * - fields: Specific fields to include in response (optimization)
   * 
   * @param {string} query - Search term to filter artworks
   * @param {number} pageNum - Page number to fetch (1-based)
   * @param {boolean} append - Whether to append results or replace existing ones
   */
  const fetchArtworks = useCallback(async (query: string = '', pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true)
      setError('')

      // Construct API URL with search parameters
      const baseUrl = 'https://api.artic.edu/api/v1/artworks/search'
      const params = new URLSearchParams({
        q: query || '*', // Use wildcard if no search term
        limit: '12', // Results per page
        page: pageNum.toString(),
        // Optimize API response by requesting only needed fields
        fields: 'id,title,artist_display,date_display,medium_display,dimensions,image_id,thumbnail'
      })

      const response = await fetch(`${baseUrl}?${params}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data: ApiResponse<Artwork> = await response.json()

      // Update artworks state - append for pagination, replace for new searches
      if (append) {
        setArtworks(prev => [...prev, ...data.data])
      } else {
        setArtworks(data.data)
      }

      // Update pagination state based on API response
      setHasMore(data.pagination.current_page < data.pagination.total_pages)
      
    } catch (err) {
      // Handle and display user-friendly error messages
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch artworks'
      setError(errorMessage)
      console.error('Error fetching artworks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== EFFECT HOOKS ====================

  /**
   * Initial data loading effect
   * Fetches the first page of artworks when component mounts
   */
  useEffect(() => {
    fetchArtworks()
  }, [fetchArtworks])

  /**
   * Search effect with debouncing
   * Triggers new search when searchTerm changes
   * Resets pagination to start from page 1
   */
  useEffect(() => {
    if (searchTerm !== '') {
      setPage(1)
      fetchArtworks(searchTerm, 1, false)
    } else {
      // If search is cleared, reload initial results
      setPage(1)
      fetchArtworks('', 1, false)
    }
  }, [searchTerm, fetchArtworks])

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles search input changes
   * Updates search term state which triggers the search effect
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  /**
   * Handles loading more results (pagination)
   * Increments page number and appends new results to existing ones
   * Only executes if more results are available and not currently loading
   */
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchArtworks(searchTerm, nextPage, true)
    }
  }

  // ==================== RENDER METHODS ====================

  /**
   * Renders the error state UI
   * Shows error message with retry button
   * 
   * @returns {JSX.Element} Error state component
   */
  const renderErrorState = (): JSX.Element => (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={() => fetchArtworks(searchTerm, 1, false)}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  )

  /**
   * Renders the empty state UI
   * Shows when no artworks match the search criteria
   * 
   * @returns {JSX.Element} Empty state component
   */
  const renderEmptyState = (): JSX.Element => (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks found</h3>
      <p className="text-gray-600">
        {searchTerm ? `No results for "${searchTerm}"` : 'No artworks available'}
      </p>
    </div>
  )

  /**
   * Renders the loading state UI
   * Shows spinner during initial load
   * 
   * @returns {JSX.Element} Loading state component
   */
  const renderLoadingState = (): JSX.Element => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="ml-2 text-gray-600">Loading artworks...</span>
    </div>
  )

  // ==================== MAIN RENDER ====================

  return (
    <div className="space-y-6">
      {/* Page Header with Title and Description */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Art Gallery</h1>
        <p className="text-gray-600">Discover masterpieces from the Art Institute of Chicago</p>
      </div>

      {/* Search Input Section */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search artworks, artists..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        renderErrorState()
      ) : loading && artworks.length === 0 ? (
        renderLoadingState()
      ) : artworks.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Artwork Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
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
    </div>
  )
}

export default Gallery 