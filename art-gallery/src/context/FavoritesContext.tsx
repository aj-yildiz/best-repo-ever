/**
 * Favorites Context Provider
 * 
 * This file implements React Context for managing the user's favorite artworks.
 * It provides global state management for favorites functionality with localStorage persistence.
 * 
 * Features:
 * - Add/remove artworks from favorites
 * - Check if an artwork is favorited
 * - Persist favorites in localStorage across browser sessions
 * - Provide favorites data to all components in the app
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Artwork } from '../types'

/**
 * Interface defining the shape of the favorites context
 * This is what components will receive when they use the useFavorites hook
 */
interface FavoritesContextType {
  /** Array of all favorited artworks */
  favorites: Artwork[]
  
  /** Function to add an artwork to favorites */
  addToFavorites: (artwork: Artwork) => void
  
  /** Function to remove an artwork from favorites by ID */
  removeFromFavorites: (artworkId: number) => void
  
  /** Function to check if an artwork is currently favorited */
  isFavorite: (artworkId: number) => boolean
}

/**
 * React Context for favorites functionality
 * Initially undefined, will be provided by FavoritesProvider
 */
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

/**
 * Custom hook to access the favorites context
 * 
 * This hook provides a clean way for components to access favorites functionality.
 * It includes error handling to ensure the hook is used within a FavoritesProvider.
 * 
 * @returns {FavoritesContextType} The favorites context object
 * @throws {Error} If used outside of FavoritesProvider
 */
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

/**
 * Props interface for the FavoritesProvider component
 */
interface FavoritesProviderProps {
  /** Child components that will have access to favorites context */
  children: ReactNode
}

/**
 * FavoritesProvider Component
 * 
 * This is the context provider that wraps the entire app to provide
 * favorites functionality to all child components.
 * 
 * @param {FavoritesProviderProps} props - Component props containing children
 * @returns {JSX.Element} Provider component with context value
 */
export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // State to store the array of favorite artworks
  const [favorites, setFavorites] = useState<Artwork[]>([])

  /**
   * Effect to load favorites from localStorage on component mount
   * This ensures favorites persist across browser sessions
   */
  useEffect(() => {
    const savedFavorites = localStorage.getItem('artGalleryFavorites')
    if (savedFavorites) {
      try {
        // Parse the JSON string back into an array of artworks
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error parsing saved favorites:', error)
        // If there's an error parsing, start with an empty array
        setFavorites([])
      }
    }
  }, [])

  /**
   * Effect to save favorites to localStorage whenever the favorites array changes
   * This ensures any changes to favorites are immediately persisted
   */
  useEffect(() => {
    localStorage.setItem('artGalleryFavorites', JSON.stringify(favorites))
  }, [favorites])

  /**
   * Function to add an artwork to the favorites list
   * 
   * @param {Artwork} artwork - The artwork object to add to favorites
   */
  const addToFavorites = (artwork: Artwork) => {
    setFavorites(prev => [...prev, artwork])
  }

  /**
   * Function to remove an artwork from the favorites list
   * 
   * @param {number} artworkId - The ID of the artwork to remove
   */
  const removeFromFavorites = (artworkId: number) => {
    setFavorites(prev => prev.filter(artwork => artwork.id !== artworkId))
  }

  /**
   * Function to check if an artwork is currently in the favorites list
   * 
   * @param {number} artworkId - The ID of the artwork to check
   * @returns {boolean} True if the artwork is favorited, false otherwise
   */
  const isFavorite = (artworkId: number) => {
    return favorites.some(artwork => artwork.id === artworkId)
  }

  // Provide the context value to all child components
  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  )
} 