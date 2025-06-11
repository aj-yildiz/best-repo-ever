/**
 * TypeScript type definitions for the Art Gallery application
 * 
 * This file contains all the interfaces and types used throughout the application
 * to ensure type safety when working with artwork data from the API.
 */

/**
 * Base Artwork interface representing the core properties of an artwork
 * from the Art Institute of Chicago API
 */
export interface Artwork {
  /** Unique identifier for the artwork */
  id: number
  
  /** Title/name of the artwork */
  title: string
  
  /** Unique identifier for the artwork's image (used to construct image URLs) */
  image_id: string
  
  /** Name of the artist who created the artwork */
  artist_title: string
  
  /** Human-readable date when the artwork was created (e.g., "1889", "c. 1920-1925") */
  date_display: string
  
  /** Optional: Description of the medium used (e.g., "Oil on canvas", "Bronze") */
  medium_display?: string
  
  /** Optional: Physical dimensions of the artwork */
  dimensions?: string
  
  /** Optional: Detailed artist information including birth/death dates and nationality */
  artist_display?: string
  
  /** Optional: Geographic location where the artwork was created */
  place_of_origin?: string
  
  /** Optional: Long-form description of the artwork (may contain HTML) */
  description?: string
  
  /** Optional: Brief description of the artwork */
  short_description?: string
}

/**
 * Extended Artwork interface for detailed artwork pages
 * 
 * This extends the base Artwork interface with additional metadata
 * that's only needed when viewing individual artwork details.
 */
export interface ArtworkDetail extends Artwork {
  /** Optional: Year the artist was born */
  artist_birth_date?: number
  
  /** Optional: Year the artist died */
  artist_death_date?: number
  
  /** Optional: Artist's nationality */
  artist_nationality?: string
  
  /** Optional: Array of category classifications for the artwork */
  category_titles?: string[]
  
  /** Optional: Artistic style or movement the artwork belongs to */
  style_title?: string
  
  /** Optional: Specific technique used to create the artwork */
  technique_title?: string
  
  /** Optional: History of where this artwork has been published */
  publication_history?: string
  
  /** Optional: History of exhibitions where this artwork has been displayed */
  exhibition_history?: string
} 