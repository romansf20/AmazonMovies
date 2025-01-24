// apiService.ts
import axios from "axios";
import Config from "react-native-config";
import { Genre, Movie } from "./types";

/**
 * apiService Module
 * 
 * This module provides functions for interacting with The Movie Database (TMDB) API to fetch
 * movie-related data such as genres, popular movies, parental ratings, and trailers. 
 * It handles API requests, error management, and data transformation where needed.
 * 
 * Key Functions:
 * - fetchGenres: Retrieves a list of movie genres from TMDB.
 * - fetchParentalRating: Fetches the parental rating for a specific movie based on its release dates.
 * - fetchMovies: Retrieves popular movies and enriches them with parental ratings.
 * - fetchTrailer: Fetches the YouTube trailer key for a specific movie.
 * 
 * Design Considerations:
 * - Centralized API configuration (TMDB base URL and API key).
 * - Graceful error handling with console logging and fallback values.
 * - Data transformations to ensure API responses are adapted for the app's needs.
  */

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const NOT_RATED = "Not Rated";

export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
    });
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const fetchParentalRating = async (movieId: number): Promise<string> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/release_dates`, {
      params: { api_key: Config.REACT_APP_TMDB_KEY },
    });
    const results = response.data.results;
    const usRelease = results.find((item: any) => item.iso_3166_1 === "US");
    if (usRelease && usRelease.release_dates.length > 0) {
      const certification = usRelease.release_dates[0].certification;
      return certification || NOT_RATED;
    }
    return NOT_RATED;
  } catch (error) {
    console.error(`Error fetching parental rating for movie ${movieId}:`, error);
    return NOT_RATED;
  }
};

export const fetchMovieDetails = async (movieId: number) => {
  try {
    const [detailsResponse, creditsResponse] = await Promise.all([
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
      }),
      axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
      }),
    ]);

    const details = detailsResponse.data;
    const credits = creditsResponse.data;

    const director = credits.crew.find((member: any) => member.job === "Director")?.name || "Unknown";
    const cast = credits.cast.slice(0, 3).map((member: any) => member.name);

    return {
      release_year: details.release_date?.split("-")[0] || "Unknown",
      description: details.overview || "No description available.",
      director,
      cast,
    };
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error);
    return {
      release_year: "Unknown",
      description: "No description available.",
      director: "Unknown",
      cast: [],
    };
  }
};

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US", page: 1 },
    });

    const moviesWithDetails = await Promise.all(
      response.data.results.map(async (movie: Movie) => {
        const parentalRating = await fetchParentalRating(movie.id);
        const details = await fetchMovieDetails(movie.id);
        return {
          ...movie,
          parental_rating: parentalRating,
          ...details,
        };
      })
    );

    return moviesWithDetails;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};


export const fetchTrailer = async (movieId: number): Promise<string | null> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
      params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
    });
    const trailer = response.data.results.find(
      (video: any) => video.site === "YouTube" && video.type === "Trailer"
    );
    return trailer ? trailer.key : null;
  } catch (error) {
    console.error(`Error fetching trailer for movie ${movieId}:`, error);
    return null;
  }
};

const apiService = {
  fetchGenres,
  fetchParentalRating,
  fetchMovies,
  fetchTrailer,
};

export default apiService;