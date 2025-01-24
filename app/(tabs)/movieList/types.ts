/**
 * Type Definitions for Movie and Genre
 * 
 * This file defines TypeScript types to ensure consistent data structure 
 * and type safety across the application for movie and genre data.
 * 
 * Types:
 * - Movie: Represents a movie object with properties such as ID, title, 
 *   genre IDs, user rating, and additional metadata like parental rating 
 *   and trailer video URL.
 * - Genre: Represents a genre object with properties for ID and name.
 * 
 * Design Considerations:
 * - `Movie` includes optional fields (`video_url`, `parental_rating`) to 
 *   handle scenarios where these values may not be available.
 * - `types` object is exported for potential future use in scenarios where 
 *   dynamic type information or runtime validation is needed.
 */

export type Movie = {
  id: number;
  title: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  poster_path: string;
  video_url: string | null;
  parental_rating: string | null;
};

export type Genre = {
  id: number;
  name: string;
};

const types = {
  Movie: null as unknown as Movie, // Use `null as unknown as` to include types in the object
  Genre: null as unknown as Genre,
};

export default types;