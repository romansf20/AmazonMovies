import React, { useEffect, useState, useRef } from "react";
import Icon from 'react-native-vector-icons/MaterialIcons';
import apiService from "./apiService";
import { VideoPlayerOverlay } from "./videoPlayerOverlay";
import constants from "./constants"
import { Genre, Movie } from "./types";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");
const WIDTH_OFFSET = 90; // value that determines how much of the neighboring movies to show on each side
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
          style={styles.backButton} 
          activeOpacity={constants.ACTIVE_OPACITY} 
          onPress={() => console.log("Back button pressed")}>
          <Icon name="chevron-left" size={32} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Top Movies</Text>
      </View>

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <TouchableOpacity
              activeOpacity={constants.ACTIVE_OPACITY}
              onPress={() => handleMovieSelect(item)}>
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
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width - WIDTH_OFFSET}
        decelerationRate="fast"
        pagingEnabled
      />
      {selectedMovie?.video_url && (
				<VideoPlayerOverlay
					videoUrl={selectedMovie?.video_url}
					showTrailer={showTrailer}
					closeTrailer={closeTrailer}
					trailerOpacity={trailerOpacity}
				/>
  		)}
	</View>
)}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e", //TODO; this sound eventually come from a Design System token
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    padding: 16, //TODO; this sound eventually come from a Design System token
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
		marginLeft: -32, // shift left by the width of the icon to ensure proper centering
    textAlign: "center",
		fontFamily: "AmazonEmberDisplayMedium",
    fontSize: 20, //TODO; this sound eventually come from a Design System token
    color: "#fff", //TODO; this sound eventually come from a Design System token
  },
  movieCard: {
    width: width - WIDTH_OFFSET,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  poster: {
    width: width * 0.6,
    height: width * 0.9,
    borderRadius: 10, //TODO; this sound eventually come from a Design System token
  },
  title: {
		width: width * 0.6, // ensure that title never extends beyond the box-art's width
    fontSize: 20,
		fontFamily: "AmazonEmberDisplayMedium",
    color: "#fff", //TODO; this sound eventually come from a Design System token
    textAlign: "center",
    marginTop: 16, //TODO; this sound eventually come from a Design System token
  },
  genres: {
    fontSize: 14,
		fontFamily: "AmazonEmberRegular",
    color: "#ccc", //TODO; this sound eventually come from a Design System token
    textAlign: "center",
    marginTop: 8, //TODO; this sound eventually come from a Design System token
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  ratingBadge: {
    backgroundColor: "#333", //TODO; this sound eventually come from a Design System token
    minWidth: 28,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 6, //TODO; this sound eventually come from a Design System token
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
    fontSize: 14, //TODO; this sound eventually come from a Design System token
		fontFamily: "AmazonEmberRegular",
    color: "#fff", //TODO; this sound eventually come from a Design System token
    textAlign: "center",
  },
});
