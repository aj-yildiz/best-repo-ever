/**
 * PostCSS Configuration
 * 
 * This file configures PostCSS for the Art Gallery application.
 * PostCSS is used to transform CSS with JavaScript plugins.
 * 
 * Plugins:
 * - tailwindcss: TailwindCSS v3 PostCSS plugin for utility-first CSS
 * - autoprefixer: Automatically adds vendor prefixes to CSS rules
 */

export default {
  plugins: {
    tailwindcss: {},      // TailwindCSS v3 standard plugin
    autoprefixer: {},     // Adds vendor prefixes automatically
  },
} 