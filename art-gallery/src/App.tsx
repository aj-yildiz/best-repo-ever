/**
 * Main App Component
 * 
 * This is the root component of the Art Gallery application.
 * It sets up the overall application structure, routing, and global providers.
 * 
 * Architecture:
 * - Uses React Router for client-side routing
 * - Wraps the app with FavoritesProvider for global state management
 * - Configures toast notifications for user feedback
 * - Sets up the main layout with navigation and page content
 * 
 * Routes:
 * - / : Gallery page (main artwork grid)
 * - /favorites : Favorites page (saved artworks)
 * - /artwork/:id : Individual artwork detail page
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from './context/FavoritesContext'
import Navigation from './components/Navigation'
import Gallery from './pages/Gallery'
import Favorites from './pages/Favorites'
import ArtworkDetail from './pages/ArtworkDetail'

/**
 * App Component
 * 
 * The main application component that sets up routing, global providers,
 * and the overall layout structure.
 * 
 * Component Hierarchy:
 * - FavoritesProvider (global state)
 *   - Router (routing)
 *     - Navigation (persistent header)
 *     - Routes (page content)
 *     - Toaster (global notifications)
 * 
 * @returns {JSX.Element} The complete application
 */
function App() {
  return (
    // Global Favorites Context Provider - makes favorites functionality available throughout the app
    <FavoritesProvider>
      {/* React Router Setup - enables client-side routing */}
      <Router>
        {/* Main Application Container */}
        <div className="min-h-screen bg-gray-50">
          
          {/* Navigation Header - always visible across all pages */}
          <Navigation />
          
          {/* Page Content Routes */}
          <Routes>
            {/* Home/Gallery Route - displays artwork grid with search */}
            <Route path="/" element={<Gallery />} />
            
            {/* Favorites Route - displays user's saved artworks */}
            <Route path="/favorites" element={<Favorites />} />
            
            {/* Artwork Detail Route - displays individual artwork information */}
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
          </Routes>
          
          {/* Global Toast Notification System */}
          <Toaster 
            position="bottom-right"  // Position notifications in bottom-right corner
            toastOptions={{
              // Default styling for all toasts
              style: {
                background: '#333',
                color: '#fff',
              },
              // Success toast styling (for favorites actions)
              success: {
                iconTheme: {
                  primary: '#10B981',  // Green color
                  secondary: '#fff',
                },
              },
              // Error toast styling (for API failures)
              error: {
                iconTheme: {
                  primary: '#EF4444',  // Red color
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </FavoritesProvider>
  )
}

export default App
