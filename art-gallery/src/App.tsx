/**
 * Main Application Component - Art Gallery
 * 
 * This is the root component of the Art Gallery application that sets up the core
 * application architecture including routing, global state management, and layout.
 * 
 * Architecture Overview:
 * - Uses React Router for client-side navigation between pages
 * - Provides global favorites state through React Context
 * - Implements toast notifications for user feedback
 * - Maintains consistent navigation across all pages
 * 
 * The application follows a single-page application (SPA) pattern where different
 * "pages" are rendered based on the current URL route, providing a smooth user
 * experience without full page reloads.
 * 
 * @author Art Gallery Team
 * @version 1.0.0
 */

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from './context/FavoritesContext'
import Navigation from './components/Navigation'
import Gallery from './pages/Gallery'
import Favorites from './pages/Favorites'
import ArtworkDetail from './pages/ArtworkDetail'
import './App.css'

/**
 * App Component - Application Root
 * 
 * This component serves as the main entry point for the application and is responsible for:
 * 
 * 1. **Routing Configuration**: Sets up all application routes using React Router
 *    - "/" - Main gallery page with artwork browsing and search
 *    - "/favorites" - User's saved favorite artworks
 *    - "/artwork/:id" - Detailed view of a specific artwork
 * 
 * 2. **Global State Management**: Wraps the app with FavoritesProvider to make
 *    favorites functionality available throughout the component tree
 * 
 * 3. **Layout Structure**: Provides consistent navigation header across all pages
 * 
 * 4. **User Feedback**: Configures toast notifications for user actions
 * 
 * Component Hierarchy:
 * ```
 * App
 * ├── FavoritesProvider (Global state)
 * │   ├── Router (Routing)
 * │   │   ├── Navigation (Header)
 * │   │   └── Routes
 * │   │       ├── Gallery (/)
 * │   │       ├── Favorites (/favorites)
 * │   │       └── ArtworkDetail (/artwork/:id)
 * │   └── Toaster (Notifications)
 * ```
 * 
 * @returns {JSX.Element} The complete application with routing and global providers
 * 
 * @example
 * ```tsx
 * // This component is typically rendered in main.tsx
 * import App from './App'
 * 
 * ReactDOM.createRoot(document.getElementById('root')!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * )
 * ```
 */
function App(): JSX.Element {
  return (
    <FavoritesProvider>
      {/* 
        BrowserRouter enables client-side routing for the application
        This allows navigation between different views without page reloads
      */}
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* 
            Navigation component appears on all pages
            Provides consistent header with logo, menu, and favorites counter
          */}
          <Navigation />
          
          {/* 
            Main content area where different pages are rendered
            based on the current route
          */}
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* 
                Home route - Gallery page with artwork browsing
                Features: search, infinite scroll, artwork grid display
              */}
              <Route path="/" element={<Gallery />} />
              
              {/* 
                Favorites route - User's saved artworks
                Shows all artworks the user has marked as favorites
                Includes empty state when no favorites exist
              */}
              <Route path="/favorites" element={<Favorites />} />
              
              {/* 
                Artwork detail route - Individual artwork view
                Dynamic route parameter :id corresponds to artwork ID
                Shows comprehensive artwork information and metadata
              */}
              <Route path="/artwork/:id" element={<ArtworkDetail />} />
            </Routes>
          </main>
        </div>
      </Router>
      
      {/* 
        Toast notification system for user feedback
        Provides non-intrusive notifications for actions like:
        - Adding/removing favorites
        - Error messages
        - Success confirmations
        
        Configuration:
        - Positioned at top-center of screen
        - Auto-dismiss after 3 seconds
        - Styled to match application theme
      */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </FavoritesProvider>
  )
}

export default App
