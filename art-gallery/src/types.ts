/**
 * TypeScript type definitions for the Art Gallery application
 * 
 * This file contains all the interface definitions used throughout the application
 * for type safety and better development experience. These types correspond to
 * the data structures returned by the Art Institute of Chicago API.
 */

/**
 * Represents a single artwork from the Art Institute of Chicago collection
 * 
 * This interface defines the structure of artwork data as received from the API.
 * Not all fields are guaranteed to be present, as the API may return incomplete
 * data for some artworks, hence most fields are optional.
 * 
 * @interface Artwork
 * @example
 * ```typescript
 * const artwork: Artwork = {
 *   id: 123456,
 *   title: "The Starry Night",
 *   artist_display: "Vincent van Gogh (Dutch, 1853-1890)",
 *   date_display: "1889",
 *   medium_display: "Oil on canvas",
 *   dimensions: "73.7 cm × 92.1 cm (29 in × 36 1/4 in)",
 *   image_id: "abc123def456",
 *   // ... other optional fields
 * };
 * ```
 */
export interface Artwork {
  /** Unique identifier for the artwork in the museum's collection */
  id: number;
  
  /** The title of the artwork as displayed in the museum */
  title?: string;
  
  /** 
   * Artist information including name, nationality, and life dates
   * Format typically: "Artist Name (Nationality, birth-death)"
   * Example: "Pablo Picasso (Spanish, 1881-1973)"
   */
  artist_display?: string;
  
  /** 
   * Human-readable date when the artwork was created
   * Can be a single year, range, or descriptive text
   * Examples: "1889", "c. 1920", "1950-1955"
   */
  date_display?: string;
  
  /** 
   * Description of the materials and techniques used
   * Examples: "Oil on canvas", "Bronze", "Watercolor on paper"
   */
  medium_display?: string;
  
  /** 
   * Physical dimensions of the artwork
   * Usually includes both metric and imperial measurements
   * Example: "73.7 cm × 92.1 cm (29 in × 36 1/4 in)"
   */
  dimensions?: string;
  
  /** 
   * Unique identifier for the artwork's image
   * Used to construct the full image URL for display
   * Combined with the museum's image server URL
   */
  image_id?: string;
  
  /** 
   * Brief description or summary of the artwork
   * May include historical context, artistic significance, or physical description
   */
  thumbnail?: {
    /** Alternative text for the image, used for accessibility */
    alt_text?: string;
  };
  
  /** 
   * Current location of the artwork within the museum
   * Examples: "Gallery 201", "Not on view", "Conservation lab"
   */
  gallery_title?: string;
  
  /** 
   * Department or collection that owns the artwork
   * Examples: "Painting and Sculpture", "Contemporary Art"
   */
  department_title?: string;
  
  /** 
   * How the museum acquired this artwork
   * Examples: "Gift of...", "Purchase", "Bequest"
   */
  credit_line?: string;
  
  /** 
   * Museum's official publication or catalog information
   * Used for scholarly references and citations
   */
  publication_history?: string;
  
  /** 
   * History of where the artwork has been displayed
   * Includes past exhibitions and loans
   */
  exhibition_history?: string;
  
  /** 
   * Detailed description of the artwork's condition, provenance, or other notes
   * May include conservation history or scholarly interpretations
   */
  provenance_text?: string;
}

/**
 * Response structure from the Art Institute of Chicago API search endpoint
 * 
 * This interface represents the wrapper object that contains the search results
 * along with pagination information. The API returns results in this standardized
 * format for all search and browse operations.
 * 
 * @interface ApiResponse
 * @template T The type of data contained in the results array
 * @example
 * ```typescript
 * const response: ApiResponse<Artwork> = {
 *   data: [artwork1, artwork2, artwork3],
 *   pagination: {
 *     total: 150,
 *     limit: 20,
 *     offset: 0,
 *     total_pages: 8,
 *     current_page: 1
 *   }
 * };
 * ```
 */
export interface ApiResponse<T> {
  /** 
   * Array of results returned by the API
   * The type T represents the structure of individual items
   * For artwork searches, this will be an array of Artwork objects
   */
  data: T[];
  
  /** 
   * Pagination information for the current request
   * Used to implement infinite scroll and page navigation
   */
  pagination: {
    /** Total number of items available across all pages */
    total: number;
    
    /** Maximum number of items returned per page */
    limit: number;
    
    /** Number of items skipped (for pagination calculation) */
    offset: number;
    
    /** Total number of pages available */
    total_pages: number;
    
    /** Current page number (1-based indexing) */
    current_page: number;
  };
}

/**
 * Configuration object for API search requests
 * 
 * This interface defines the parameters that can be sent to the API
 * to customize search results. All parameters are optional, allowing
 * for flexible querying of the artwork collection.
 * 
 * @interface SearchParams
 * @example
 * ```typescript
 * const searchConfig: SearchParams = {
 *   q: "van gogh",
 *   limit: 20,
 *   page: 1,
 *   fields: "id,title,artist_display,image_id"
 * };
 * ```
 */
export interface SearchParams {
  /** 
   * Search query string
   * Searches across artwork titles, artist names, and other text fields
   * Supports partial matches and is case-insensitive
   */
  q?: string;
  
  /** 
   * Number of results to return per page
   * Default is typically 12, maximum varies by API endpoint
   * Used for pagination and performance optimization
   */
  limit?: number;
  
  /** 
   * Page number for pagination (1-based)
   * Used in conjunction with limit to fetch specific result sets
   * Page 1 returns items 1-limit, page 2 returns items (limit+1)-(2*limit), etc.
   */
  page?: number;
  
  /** 
   * Comma-separated list of fields to include in the response
   * Allows for optimized API calls by requesting only needed data
   * Reduces payload size and improves performance
   * Example: "id,title,artist_display,image_id,date_display"
   */
  fields?: string;
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