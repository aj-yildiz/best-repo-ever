/**
 * Tailwind CSS v3 Configuration
 * 
 * This file configures Tailwind CSS for the Art Gallery application.
 * It defines which files to scan for classes and sets up custom styling extensions.
 * 
 * Configuration:
 * - Content paths: Specifies files to scan for Tailwind classes
 * - Theme extensions: Custom animations and styling
 * - Plugins: Additional functionality (line-clamp is built-in as of v3.3)
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Content configuration - tells Tailwind where to look for class names
  content: [
    "./index.html",                    // Main HTML file
    "./src/**/*.{js,ts,jsx,tsx}",     // All source files (JavaScript, TypeScript, JSX, TSX)
  ],
  
  // Theme configuration - extends default Tailwind theme
  theme: {
    extend: {
      // Custom animations
      animation: {
        // Enhanced pulse animation for loading states
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  
  // Plugins - additional functionality
  // Note: line-clamp is now built-in as of TailwindCSS v3.3+
  plugins: [],
} 