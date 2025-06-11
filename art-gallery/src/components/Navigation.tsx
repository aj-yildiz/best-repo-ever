/**
 * Navigation Component
 * 
 * This component provides the main navigation bar for the art gallery application.
 * It includes routing between different pages and displays a favorites counter.
 * 
 * Features:
 * - Responsive navigation with logo and menu items
 * - Active page highlighting
 * - Favorites counter badge
 * - Sticky positioning for always-visible navigation
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Image, Heart } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

/**
 * Navigation Component
 * 
 * Renders the top navigation bar with links to different pages of the application.
 * Uses React Router for navigation and shows visual indicators for the current page.
 * 
 * @returns {JSX.Element} The navigation bar component
 */
const Navigation: React.FC = () => {
  // Get favorites data from context to show the count
  const { favorites } = useFavorites()
  
  // Get current location to determine which nav item should be highlighted
  const location = useLocation()

  /**
   * Helper function to determine if a navigation link is currently active
   * 
   * @param {string} path - The path to check against current location
   * @returns {boolean} True if the current path matches the provided path
   */
  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      {/* Container for responsive layout */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/Brand - Links to home page */}
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Art Gallery
          </Link>
          
          {/* Navigation Menu */}
          <div className="flex space-x-8">
            
            {/* Gallery/Home Link */}
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700'  // Active state styling
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'  // Default state styling
              }`}
            >
              <Image size={20} />
              <span>Gallery</span>
            </Link>
            
            {/* Favorites Link with Counter Badge */}
            <Link
              to="/favorites"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors relative ${
                isActive('/favorites') 
                  ? 'bg-red-100 text-red-700'  // Active state styling
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'  // Default state styling
              }`}
            >
              {/* Heart icon - filled when on favorites page */}
              <Heart size={20} fill={isActive('/favorites') ? 'currentColor' : 'none'} />
              <span>Favorites</span>
              
              {/* Counter Badge - only shows when there are favorites */}
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation