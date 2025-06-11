/**
 * Gallery Page Component
 * 
 * This is the main page of the application that displays a searchable grid of artworks.
 * It fetches data from the Art Institute of Chicago API and provides search and pagination functionality.
 * 
 * Features:
 * - Fetches artworks from external API
 * - Real-time search functionality
 * - Infinite scroll with "Load More" button
 * - Loading states and error handling
 * - Responsive grid layout
 * - Filters out artworks without images
 */

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { RefreshCw, Search } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'
import type { Artwork } from '../types'

/**
 * Gallery Component
 * 
 * The main gallery page that displays artworks in a searchable, paginated grid.
 * Manages its own state for artworks, loading, search, and pagination.
 * 
 * @returns {JSX.Element} The gallery page component
 */
const Gallery: React.FC = () => {
  // State for storing the fetched artworks
  const [artworks, setArtworks] = useState<Artwork[]>([])
  
  // Loading state for API requests
  const [loading, setLoading] = useState(true)
  
  // Current search term entered by the user
  const [searchTerm, setSearchTerm] = useState('')
  
  // Current page number for pagination
  const [page, setPage] = useState(1)
  
  // Flag to indicate if there are more artworks to load
  const [hasMore, setHasMore] = useState(true)

  /**
   * Fetches artworks from the Art Institute of Chicago API
   * 
   * This function handles both initial loads and pagination.
   * It filters out artworks that don't have images and manages pagination state.
   * 
   * @param {number} pageNum - The page number to fetch (default: 1)
   * @param {string} search - The search term to filter artworks (default: '')
   */
  const fetchArtworks = async (pageNum = 1, search = '') => {
    try {
      setLoading(true)
      
      // Make API request to the Art Institute of Chicago
      const response = await axios.get('https://api.artic.edu/api/v1/artworks/search', {
        params: {
          q: search || undefined,  // Only include search param if there's a search term
          limit: 12,  // Number of artworks per page
          page: pageNum,  // Current page number
          // Specify which fields we need to reduce payload size
          fields: 'id,title,image_id,artist_title,date_display,place_of_origin,medium_display,dimensions,artist_display'
        }
      })
      
      // Filter out artworks without images (image_id is required for display)
      const newArtworks = response.data.data.filter((artwork: Artwork) => artwork.image_id)
      
      if (pageNum === 1) {
        // Replace artworks for new search or refresh
        setArtworks(newArtworks)
      } else {
        // Append artworks for pagination (Load More)
        setArtworks(prev => [...prev, ...newArtworks])
      }
      
      // Update pagination state based on API response
      setHasMore(response.data.pagination.current_page < response.data.pagination.total_pages)
    } catch (error) {
      console.error('Error fetching artworks:', error)
      // TODO: Could add error state and show user-friendly error message
    } finally {
      setLoading(false)
    }
  }

  /**
   * Effect to trigger artwork fetching when search term changes
   * Resets pagination to page 1 for new searches
   */
  useEffect(() => {
    fetchArtworks(1, searchTerm)
    setPage(1)
  }, [searchTerm])

  /**
   * Handles the search form submission
   * Prevents default form submission and triggers artwork fetch
   * 
   * @param {React.FormEvent} e - Form submission event
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchArtworks(1, searchTerm)
    setPage(1)
  }

  /**
   * Loads more artworks for pagination
   * Increments page number and fetches additional artworks
   */
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArtworks(nextPage, searchTerm)
  }

  /**
   * Refreshes the gallery by clearing search and fetching all artworks
   * Resets all state to initial values
   */
  const refreshGallery = () => {
    setSearchTerm('')
    setPage(1)
    fetchArtworks(1, '')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Discover Amazing Artworks
          </h1>
          <p className="text-gray-600 text-lg">
            Explore masterpieces from the Art Institute of Chicago
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            
            {/* Search Input with Icon */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search artworks, artists, or styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            {/* Search Submit Button */}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Search
            </button>
            
            {/* Refresh/Clear Button */}
            <button
              type="button"
              onClick={refreshGallery}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RefreshCw size={20} />
            </button>
          </form>
        </div>

        {/* Loading State - Shows spinner when loading initial artworks */}
        {loading && artworks.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Artworks Grid - Only show when we have artworks */}
        {artworks.length > 0 && (
          <>
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>

            {/* Load More Button - Shows when there are more pages available */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Artworks'}
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results State - Shows when search returns no artworks */}
        {!loading && artworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artworks found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery 