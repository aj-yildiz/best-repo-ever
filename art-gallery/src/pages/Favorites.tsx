/**
 * Favorites Page Component
 * 
 * This page displays all artworks that the user has marked as favorites.
 * It provides a dedicated view for managing and browsing saved artworks.
 * 
 * Features:
 * - Displays favorited artworks in a grid layout
 * - Shows count of total favorites
 * - Empty state with call-to-action when no favorites exist
 * - Uses same ArtworkCard component as Gallery for consistency
 * - Responsive design matching the overall app theme
 */

import React from 'react'
import { Heart } from 'lucide-react'
import ArtworkCard from '../components/ArtworkCard'
import { useFavorites } from '../context/FavoritesContext'

/**
 * Favorites Component
 * 
 * Renders the favorites page with either a grid of favorited artworks
 * or an empty state encouraging users to start favoriting artworks.
 * 
 * @returns {JSX.Element} The favorites page component
 */
const Favorites: React.FC = () => {
  // Get favorites data from the context
  const { favorites } = useFavorites()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Page Header with Heart Icon */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            {/* Heart icon as page identifier */}
            <Heart size={40} className="text-red-500" fill="currentColor" />
            <h1 className="text-4xl font-bold text-gray-800">
              My Favorite Artworks
            </h1>
          </div>
          
          {/* Dynamic description based on favorites count */}
          <p className="text-gray-600 text-lg">
            {favorites.length > 0 
              ? `You have ${favorites.length} favorite ${favorites.length === 1 ? 'artwork' : 'artworks'}`
              : 'Start exploring and add artworks to your favorites'
            }
          </p>
        </div>

        {/* Conditional Rendering: Grid vs Empty State */}
        {favorites.length > 0 ? (
          // Favorites Grid - Shows when user has favorited artworks
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : (
          // Empty State - Shows when user has no favorites
          <div className="text-center py-20">
            {/* Large heart icon for visual appeal */}
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            
            {/* Empty state heading */}
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No favorites yet
            </h3>
            
            {/* Instructional text */}
            <p className="text-gray-500 mb-8">
              Browse the gallery and click the heart icon on artworks you love to add them here.
            </p>
            
            {/* Call-to-action button to navigate to gallery */}
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Heart size={20} className="mr-2" />
              Start Exploring
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites 