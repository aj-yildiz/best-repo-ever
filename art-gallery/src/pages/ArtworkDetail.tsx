/**
 * Artwork Detail Page Component
 * 
 * This component displays comprehensive information about a single artwork.
 * It fetches detailed artwork data from the API and presents it in a rich, responsive layout.
 * 
 * Features:
 * - Fetches detailed artwork information from API
 * - Large image display with favorite toggle
 * - Comprehensive metadata display with icons
 * - Responsive two-column layout (image + details)
 * - HTML content rendering for descriptions
 * - Loading and error states
 * - Navigation back to gallery
 * - Category tags display
 */

import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Calendar, MapPin, Palette, User } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useFavorites } from '../context/FavoritesContext'
import type { ArtworkDetail } from '../types'

/**
 * ArtworkDetailPage Component
 * 
 * Displays detailed information about a specific artwork, including
 * high-resolution image, comprehensive metadata, and description.
 * 
 * @returns {JSX.Element} The artwork detail page component
 */
const ArtworkDetailPage: React.FC = () => {
  // Get artwork ID from URL parameters
  const { id } = useParams<{ id: string }>()
  
  // State for storing the detailed artwork data
  const [artwork, setArtwork] = useState<ArtworkDetail | null>(null)
  
  // Loading state for API request
  const [loading, setLoading] = useState(true)
  
  // Get favorites functionality from context
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  /**
   * Effect to fetch artwork details when component mounts or ID changes
   */
  useEffect(() => {
    /**
     * Fetches detailed artwork information from the API
     * Includes additional fields not needed in the gallery view
     */
    const fetchArtworkDetail = async () => {
      try {
        setLoading(true)
        
        // Fetch detailed artwork data from the API
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks/${id}`, {
          params: {
            // Request comprehensive fields for detailed view
            fields: 'id,title,image_id,artist_title,date_display,place_of_origin,medium_display,dimensions,artist_display,description,short_description,artist_birth_date,artist_death_date,category_titles,style_title,technique_title'
          }
        })
        
        setArtwork(response.data.data)
      } catch (error) {
        console.error('Error fetching artwork detail:', error)
        toast.error('Failed to load artwork details')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if we have an ID
    if (id) {
      fetchArtworkDetail()
    }
  }, [id])

  /**
   * Handles the favorite button click
   * Toggles favorite status and shows appropriate toast notification
   */
  const handleFavoriteClick = () => {
    if (!artwork) return

    if (isFavorite(artwork.id)) {
      // Remove from favorites
      removeFromFavorites(artwork.id)
      toast.success('Removed from favorites', {
        icon: '💔',
        duration: 2000,
      })
    } else {
      // Add to favorites
      addToFavorites(artwork)
      toast.success('Added to favorites!', {
        icon: '❤️',
        duration: 2000,
      })
    }
  }

  // Loading State - Show spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Error State - Show when artwork not found
  if (!artwork) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Artwork not found</h2>
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  // Check if this artwork is favorited
  const isArtworkFavorite = isFavorite(artwork.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Back Navigation Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Gallery
        </Link>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="lg:flex">
            
            {/* Image Section - Left side on large screens */}
            <div className="lg:w-1/2">
              <div className="relative">
                {/* High-resolution artwork image */}
                <img
                  src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/800,/0/default.jpg`}
                  alt={artwork.title}
                  className="w-full h-96 lg:h-full object-cover"
                  onError={(e) => {
                    // Fallback image if main image fails to load
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Image+Not+Available'
                  }}
                />
                
                {/* Floating Favorite Button */}
                <button
                  onClick={handleFavoriteClick}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-colors shadow-lg ${
                    isArtworkFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'  // Favorited state
                      : 'bg-white text-gray-800 hover:bg-gray-100'  // Default state
                  }`}
                >
                  <Heart 
                    size={24} 
                    fill={isArtworkFavorite ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>

            {/* Details Section - Right side on large screens */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              
              {/* Artwork Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {artwork.title}
              </h1>

              {/* Metadata Section with Icons */}
              <div className="space-y-6">
                
                {/* Artist Information */}
                {artwork.artist_title && (
                  <div className="flex items-start gap-3">
                    <User className="text-blue-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Artist</p>
                      <p className="text-gray-600">{artwork.artist_title}</p>
                    </div>
                  </div>
                )}

                {/* Creation Date */}
                {artwork.date_display && (
                  <div className="flex items-start gap-3">
                    <Calendar className="text-green-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Date</p>
                      <p className="text-gray-600">{artwork.date_display}</p>
                    </div>
                  </div>
                )}

                {/* Place of Origin */}
                {artwork.place_of_origin && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-red-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Origin</p>
                      <p className="text-gray-600">{artwork.place_of_origin}</p>
                    </div>
                  </div>
                )}

                {/* Medium/Materials */}
                {artwork.medium_display && (
                  <div className="flex items-start gap-3">
                    <Palette className="text-purple-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-gray-700">Medium</p>
                      <p className="text-gray-600">{artwork.medium_display}</p>
                    </div>
                  </div>
                )}

                {/* Physical Dimensions */}
                {artwork.dimensions && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 border-2 border-orange-500 mt-1"></div>
                    <div>
                      <p className="font-semibold text-gray-700">Dimensions</p>
                      <p className="text-gray-600">{artwork.dimensions}</p>
                    </div>
                  </div>
                )}

                {/* Artistic Style */}
                {artwork.style_title && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-teal-500 rounded-full mt-1"></div>
                    <div>
                      <p className="font-semibold text-gray-700">Style</p>
                      <p className="text-gray-600">{artwork.style_title}</p>
                    </div>
                  </div>
                )}

                {/* Category Tags */}
                {artwork.category_titles && artwork.category_titles.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-indigo-500 rounded-sm mt-1"></div>
                    <div>
                      <p className="font-semibold text-gray-700">Categories</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {artwork.category_titles.map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              {(artwork.description || artwork.short_description) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">About This Artwork</h3>
                  {/* Render HTML content safely - descriptions may contain formatting */}
                  <div 
                    className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: artwork.description || artwork.short_description || '' 
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkDetailPage 