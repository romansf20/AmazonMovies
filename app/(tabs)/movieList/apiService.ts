// apiService.ts
import axios from "axios";
import Config from "react-native-config";
import { Genre, Movie } from "./types";

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

export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US", page: 1 },
    });
    const moviesWithRatings = await Promise.all(
      response.data.results.map(async (movie: Movie) => {
        const parentalRating = await fetchParentalRating(movie.id);
        return { ...movie, parental_rating: parentalRating };
      })
    );
    return moviesWithRatings;
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