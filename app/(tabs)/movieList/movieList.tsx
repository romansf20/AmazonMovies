import React, { useEffect, useState, useRef } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import apiService from "./apiService";
import { VideoPlayerOverlay } from "./videoPlayerOverlay";
import constants from "./constants";
import { Genre, Movie } from "./types";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import movieCommon from "./movieCommon"; 
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
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieListScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const trailerOpacity = useRef(new Animated.Value(0)).current;

	const handleMovieSelect = async (movie: Movie) => {
		const {
			id,
			title,
			release_year,
			parental_rating,
			vote_average,
			description,
			director,
			cast,
		} = movie;
	
		setSelectedMovie({
			...movie,
			video_url: await apiService.fetchTrailer(id),
			title,
			release_year,
			parental_rating,
			vote_average,
			genres: movieCommon.getGenreNames(movie.genre_ids, genres),
			description,
			director,
			cast,
		});
	
		setShowTrailer(true);
		Animated.timing(trailerOpacity, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		}).start();
	};

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      const genresData = await apiService.fetchGenres();
      setGenres(genresData);
      const moviesData = await apiService.fetchMovies();
      setMovies(moviesData);
    };

    initializeData();
  }, []);

	const renderItem = ({ item }: { item: Movie }) => (
		<View style={styles.movieCard}>
			<TouchableOpacity
				activeOpacity={constants.ACTIVE_OPACITY}
				onPress={() => handleMovieSelect(item)}
			>
				<Image
					source={{ uri: IMAGE_BASE_URL + item?.poster_path }}
					style={styles.poster}
				/>
				<Text style={movieCommon.styles.title}>{item?.title}</Text>
				<View style={movieCommon.styles.ratingsContainer}>
					{movieCommon.renderParentalRating(item?.parental_rating)}
					{movieCommon.renderUserRating(item?.vote_average)}
				</View>
				<Text style={movieCommon.styles.genres}>{movieCommon.getGenreNames(item?.genre_ids, genres)}</Text>
			</TouchableOpacity>
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
					renderItem={renderItem}
					mode="parallax" // Enables parallax effect for smoother transitions
					modeConfig={{
						parallaxScrollingScale: 0.9, // Scale for adjacent items
						parallaxScrollingOffset: 100, // Visible portion of adjacent items
					}}
					scrollAnimationDuration={400}
				/>
			</View>
      {selectedMovie && selectedMovie?.video_url && (
        <VideoPlayerOverlay
          videoUrl={selectedMovie?.video_url}
          showTrailer={showTrailer}
          closeTrailer={closeTrailer}
          trailerOpacity={trailerOpacity}
					selectedMovie={selectedMovie}
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
    width: constants.POSTER_WIDTH,
    height: constants.POSTER_HEIGHT,
    borderRadius: 10, 
  },
});
