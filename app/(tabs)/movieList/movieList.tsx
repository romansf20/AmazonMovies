import React, { useEffect, useState, useRef } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "./apiService";
import { VideoPlayerOverlay } from "./videoPlayerOverlay";
import constants from "./constants";
import { Genre, Movie } from "./types";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";

/**
 * MovieListScreen Component
 * 
 * This component displays a list of top movies in a horizontally scrollable carousel, 
 * featuring movie posters, titles, genres, user ratings, and parental ratings. 
 * Users can interact with the carousel to select a movie and view its trailer if available.
 * 
 * Key Features:
 * - Fetches movie and genre data from an API and dynamically updates the state.
 * - Displays movies in a parallax-style animated carousel using `react-native-reanimated-carousel`.
 * - Implements smooth transitions and animations when showing trailers.
 * - Allows users to view detailed movie information, including genre and ratings.
 * - Integrates a `VideoPlayerOverlay` for playing movie trailers.
 * 
 * Design Considerations:
 * - Responsive layout adapts to different screen sizes using `Dimensions`.
 * - Styled using `StyleSheet` for a clean and maintainable codebase.
 * - Constants and reusable components ensure scalability and easier localization.
 * 
 * TODOs:
 * - Move hardcoded styles like colors, fonts, and padding to a centralized Design System.
 * - Localize static text for better accessibility across regions.
 */

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const POSTER_WIDTH = width * 0.6 * 1.1;
const POSTER_HEIGHT = width * 0.9 * 1.1;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const NO_TRAILER_AVAILABLE = "No trailer available"; // TODO: this should live in a UI constants file where it can also be localized

export default function MovieListScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerOpacity = useRef(new Animated.Value(0)).current;

  const getGenreNames = (ids: number[]): string => {
    return ids
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
  };

  const handleMovieSelect = async (movie: Movie) => {
    setSelectedMovie(movie);
    const trailerKey = await apiService.fetchTrailer(movie.id);

    if (trailerKey) {
      setSelectedMovie({ ...movie, video_url: trailerKey });
      setShowTrailer(true);
      Animated.timing(trailerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      console.warn(`${NO_TRAILER_AVAILABLE} for movie ${movie.title || "Unknown"}`);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      const genresData = await apiService.fetchGenres();
      setGenres(genresData);

      const moviesData = await apiService.fetchMovies(genresData);
      setMovies(moviesData);
    };

    initializeData();
  }, []);

  const renderUserRating = (voteAverage: number) => (
    <View style={[styles.ratingBadge, styles.userRatingBadge]}>
      <Icon name="star" size={16} color="#FFD700" style={styles.starIcon} />
      <Text style={styles.ratingText}>{voteAverage.toFixed(1)}</Text>
    </View>
  );

  const renderParentalRating = (parentalRating: string | null) => (
    <View style={styles.ratingBadge}>
      <Text style={styles.ratingText}>{parentalRating}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
			<TouchableOpacity 
          activeOpacity={constants.ACTIVE_OPACITY} 
          onPress={() => console.log("Back button pressed")}>
          <Icon name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Top Movies</Text>
      </View>
			
			<View style={styles.carouselContainer}>
				<ReanimatedCarousel
					width={width} // Width of each item
					height={height * 0.6} // Height of each item
					data={movies}
					renderItem={({ item }) => (
						<View style={styles.movieCard}>
							<TouchableOpacity
								activeOpacity={constants.ACTIVE_OPACITY}
								onPress={() => handleMovieSelect(item)}
							>
								<Image
									source={{ uri: IMAGE_BASE_URL + item?.poster_path }}
									style={styles.poster}
								/>
								<Text style={styles.title}>{item?.title}</Text>
								<View style={styles.ratingsContainer}>
									{renderParentalRating(item?.parental_rating)}
									{renderUserRating(item?.vote_average)}
								</View>
								<Text style={styles.genres}>{getGenreNames(item?.genre_ids)}</Text>
							</TouchableOpacity>
						</View>
					)}
					mode="parallax" // Enables parallax effect for smoother transitions
					modeConfig={{
						parallaxScrollingScale: 0.9, // Scale for adjacent items
						parallaxScrollingOffset: 100, // Visible portion of adjacent items
					}}
					scrollAnimationDuration={400}
				/>
			</View>
      {selectedMovie?.video_url && (
        <VideoPlayerOverlay
          videoUrl={selectedMovie?.video_url}
          showTrailer={showTrailer}
          closeTrailer={closeTrailer}
          trailerOpacity={trailerOpacity}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e", 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    padding: 16, 
  },
	carouselContainer: {
		top: 50
	},
  headerTitle: {
    flex: 1,
		marginRight: 32, // shift left by the width of the icon to ensure proper centering
    textAlign: "center",
    fontFamily: "AmazonEmberDisplayMedium",
    fontSize: 20, 
    color: "#fff", 
  },
  movieCard: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 10, 
  },
  title: {
    width: POSTER_WIDTH, // ensure that title never extends beyond the box-art's width
    fontSize: 20,
    fontFamily: "AmazonEmberDisplayMedium",
    color: "#fff", 
    textAlign: "center",
    marginTop: 16, 
  },
  genres: {
    fontSize: 14,
    fontFamily: "AmazonEmberRegular",
    color: "#ccc", 
    textAlign: "center",
    marginTop: 8, 
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  ratingBadge: {
    backgroundColor: "#333", 
    minWidth: 28,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 6, 
    marginHorizontal: 5,
  },
  userRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14, 
    fontFamily: "AmazonEmberRegular",
    color: "#fff", 
    textAlign: "center",
  },
});
