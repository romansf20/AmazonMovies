import React, { useEffect, useState, useRef } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
} from "react-native";
import axios from "axios";
import YouTube from "react-native-youtube-iframe";
import Config from "react-native-config";

const { width } = Dimensions.get("window");

type Movie = {
  id: number;
  title: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  poster_path: string;
  video_url: string | null;
  parental_rating: string | null;
};
type Genre = {
  id: number;
  name: string;
};

const IMAGE_BORDER_RADIUS = 10;
const WIDTH_OFFSET = 90; // value that determines how much of the neighboring movies to show on each side
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const ACTIVE_OPACITY = 0.5;

export default function GrowScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]); // Store genres
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  // Fetch the genre list
  const fetchGenres = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
      });
      setGenres(response.data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

	// Fetch parental rating for a movie
	const fetchParentalRating = async (movieId: number): Promise<string | null> => {
		try {
			const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/release_dates`, {
				params: { api_key: Config.REACT_APP_TMDB_KEY },
			});
			const results = response.data.results;
			const usRelease = results.find((item: any) => item.iso_3166_1 === "US");
			if (usRelease && usRelease.release_dates.length > 0) {
				const certification = usRelease.release_dates[0].certification;
				return certification || "Not Rated";
			}
			return "Not Rated";
		} catch (error) {
			console.error(`Error fetching parental rating for movie ${movieId}:`, error);
			return "Not Rated";
		}
	};

  // Fetch popular movies and include parental rating
  const fetchMovies = async () => {
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
      setMovies(moviesWithRatings);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

	// Fetch full url of the trailer
	const fetchTrailer = async (movie: Movie) => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}/videos`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
      });
      const trailer = response.data.results.find(
        (video: any) => video.site === "YouTube" && video.type === "Trailer"
      );
      // console.log(Trailer for movie ${movie.title}:, trailer);
      return trailer ? trailer.key : null; // Return the YouTube video key
    } catch (error) {
      console.error(`Error fetching trailer for movie ${movie.id}:, error`);
      return null;
    }
  };


  // Get genre names from IDs
	const getGenreNames = (ids: number[]): string => {
		return ids
			.map((id) => genres.find((genre) => genre.id === id)?.name)
			.filter(Boolean) // Remove undefined values
			.slice(0, 3) // Display only the first 3 genres
			.join(", ");
	};

	const handleMovieSelect = async (movie: Movie) => {
    setSelectedMovie(movie);
    const trailerKey = await fetchTrailer(movie);

    if (trailerKey) {
      setSelectedMovie({ ...movie, video_url: trailerKey });
        setShowTrailer(true); // Show trailer after 5 seconds
				Animated.timing(opacity, {
					toValue: 1,
					duration: 500, // Fade-in duration
					useNativeDriver: true,
			}).start();
    } else {
      console.warn(`No trailer available for movie ${movie.title}`);
    }
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  useEffect(() => {
    fetchGenres(); // Fetch genres first
    fetchMovies(); // Fetch movies next
  }, []);

	const renderUserRating = (voteAverage:number) => {
		return (
			<View style={[styles.ratingBadge, styles.userRatingBadge]}>
				<Icon name="star" size={16} color="#FFD700" style={styles.starIcon} />
				<Text style={styles.ratingText}>
					{voteAverage.toFixed(1)}
				</Text>
			</View>
		)
	} 

	const renderParentalRating = (parentalRating:string | null) => {
		return (
			<View style={styles.ratingBadge}>
				<Text style={styles.ratingText}>
					{parentalRating}
				</Text>
			</View>
		)
	}

	const renderVideoPlayerOverlay = (videoUrl: string) => {
		console.log("video_url " + videoUrl);
		
		return (
			<Modal
				visible={showTrailer}
				transparent={true}
				animationType="fade"
				onRequestClose={closeTrailer}
			>
				<View style={styles.overlay}>
					<Animated.View style={[styles.trailerBox, { opacity }]}>
						<TouchableOpacity 
							style={styles.closeButton} 
							onPress={closeTrailer} 
							activeOpacity={ACTIVE_OPACITY}
						>
							<View style={styles.closeButtonCircle}>
								<Icon name="close" size={24} color="#fff" />
							</View>
						</TouchableOpacity>
						<View style={styles.youtubeWrapper}>
							<YouTube
								videoId={videoUrl}
								height={300}
								width={width}
								play={true}
								webViewProps={{
									allowsFullscreenVideo: true,
									androidLayerType: "hardware",
								}}
								onError={(e) => console.error("YouTube playback error:", e)}
							/>
						</View>
					</Animated.View>
				</View>
			</Modal>
		)
	}

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={({ item }) => (
					<View style={styles.movieCard}>
						<TouchableOpacity
							style={styles.movieCardButton}
							activeOpacity={ACTIVE_OPACITY}
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
							<Text style={styles.genres}>
								{getGenreNames(item?.genre_ids)}
							</Text>
						</TouchableOpacity>
					</View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width - WIDTH_OFFSET}
        decelerationRate="fast"
        pagingEnabled
      />
		{selectedMovie?.video_url && 
			renderVideoPlayerOverlay(selectedMovie?.video_url)}		
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  movieCard: {
    width: width - WIDTH_OFFSET,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#1e1e1e",
  },
	movieCardButton: {

	},
  poster: {
    width: width * 0.6,
    height: width * 0.9,
    borderRadius: IMAGE_BORDER_RADIUS,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
		textAlign: "center",
		marginTop: 16,
  },
  genres: {
    fontSize: 14,
    color: "#ccc",
    textAlign: "center",
		marginTop: 10
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
		justifyContent: "center",
    marginTop: 12,
  },
  ratingBadge: {
    backgroundColor: "#333",
		color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginHorizontal: 5,
  },
	userRatingBadge: {
    flexDirection: "row", // Align star and text horizontally
    alignItems: "center",
  },
  starIcon: {
    marginRight: 5, // Space between the star and the rating text
  },
  ratingText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.83)",
    justifyContent: "center",
    alignItems: "center",
  },
  trailerBox: {
    backgroundColor: "#000",
    width: width,
    alignItems: "center",
		marginTop: -80,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: -2,
		zIndex: 10,
  },
  closeButtonCircle: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    opacity: 0.5,
    borderRadius: 16,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  youtubeWrapper: {
    overflow: "hidden",
    // borderRadius: IMAGE_BORDER_RADIUS,
		// marginTop: -50,
    height: 220,
    alignSelf: "center",
		paddingTop: 14,
		// paddingBottom: 18,
  },
});