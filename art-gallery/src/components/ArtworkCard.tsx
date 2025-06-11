/**
 * ArtworkCard Component
 * 
 * This component displays individual artwork information in a card format.
 * It's used in both the Gallery and Favorites pages to show artwork previews.
 * 
 * Features:
 * - Responsive card design with hover effects
 * - Image display with fallback for missing images
 * - Favorite toggle functionality with toast notifications
 * - Navigation to detailed artwork view
 * - Visual indicators for favorited items
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import { useFavorites } from '../context/FavoritesContext'
import type { Artwork } from '../types'

/**
 * Props interface for the ArtworkCard component
 */
interface ArtworkCardProps {
  /** The artwork data to display in the card */
  artwork: Artwork
}

/**
 * ArtworkCard Component
 * 
 * Renders a single artwork as an interactive card with image, metadata,
 * and action buttons for viewing details and toggling favorites.
 * 
 * @param {ArtworkCardProps} props - Component props
 * @returns {JSX.Element} The artwork card component
 */
const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  // Get favorites functionality from context
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  // Check if this artwork is currently favorited
  const isArtworkFavorite = isFavorite(artwork.id)

  /**
   * Handles the favorite button click event
   * Toggles the artwork's favorite status and shows appropriate toast notification
   * 
   * @param {React.MouseEvent} e - Click event object
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    // Prevent event bubbling to avoid triggering parent click handlers
    e.preventDefault()
    e.stopPropagation()
    
    if (isArtworkFavorite) {
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

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      
      {/* Image Container with Overlay Actions */}
      <div className="relative">
        {/* Artwork Image */}
        <img
          src={`https://www.artic.edu/iiif/2/${artwork.image_id}/full/400,/0/default.jpg`}
          alt={artwork.title}
          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if the original fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Available'
          }}
        />
        
        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
            
            {/* View Details Button */}
            <Link
              to={`/artwork/${artwork.id}`}
              className="bg-white text-gray-800 p-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Eye size={20} />
            </Link>
            
            {/* Favorite Toggle Button */}
            <button
              onClick={handleFavoriteClick}
              className={`p-3 rounded-full transition-colors shadow-lg ${
                isArtworkFavorite
                  ? 'bg-red-500 text-white hover:bg-red-600'  // Favorited state
                  : 'bg-white text-gray-800 hover:bg-gray-100'  // Default state
              }`}
            >
              <Heart 
                size={20} 
                fill={isArtworkFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>

        {/* Favorite Indicator (Always Visible) */}
        {isArtworkFavorite && (
          <div className="absolute top-4 right-4">
            <Heart 
              size={24} 
              className="text-red-500" 
              fill="currentColor"
            />
          </div>
        )}
      </div>
      
      {/* Card Content - Artwork Information */}
      <div className="p-6">
        {/* Artwork Title - Limited to 2 lines with ellipsis */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {artwork.title}
        </h3>
        
        {/* Artist Name */}
        <p className="text-gray-600 text-sm mb-1">
          {artwork.artist_title || 'Unknown Artist'}
        </p>
        
        {/* Creation Date */}
        <p className="text-gray-500 text-sm">
          {artwork.date_display}
        </p>
        
        {/* Origin (if available) */}
        {artwork.place_of_origin && (
          <p className="text-gray-500 text-xs mt-2">
            Origin: {artwork.place_of_origin}
          </p>
        )}
      </div>
    </div>
  )
}

export default ArtworkCard 