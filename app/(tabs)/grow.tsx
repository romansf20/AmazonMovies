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
};

const IMAGE_BORDER_RADIUS = 10; // TODO: should come from a Design System token
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function GrowScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
	const opacity = useRef(new Animated.Value(0)).current;

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US", page: 1 },
      });
      const moviesWithTrailers = response.data.results.map((movie: Movie) => ({
        ...movie,
        video_url: null, // Trailer URLs fetched dynamically
      }));
      setMovies(moviesWithTrailers);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchTrailer = async (movie: Movie) => {
    try {
      const response = await axios.get(`${TMDB_API}/movie/${movie.id}/videos`, {
        params: { api_key: Config.REACT_APP_TMDB_KEY, language: "en-US" },
      });
      const trailer = response.data.results.find(
        (video: any) => video.site === "YouTube" && video.type === "Trailer"
      );
      return trailer ? trailer.key : null;
    } catch (error) {
      console.error(`Error fetching trailer for movie ${movie.id}:`, error);
      return null;
    }
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

  const handleMovieDeselect = () => {
    setSelectedMovie(null);
    setShowTrailer(false); // Close trailer if visible
  };

  const closeTrailer = () => {
    setShowTrailer(false);
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
			activeOpacity={0.7} 
      onPress={() => handleMovieSelect(item)}
    >
      <Image
        source={{ uri: IMAGE_BASE_URL + item.poster_path }}
        style={styles.poster}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.info}>
        Parental Rating: {item.adult ? "Adult" : "General"}
      </Text>
      <Text style={styles.info}>User Rating: {item.vote_average}</Text>
      <Text style={styles.info}>Genre IDs: {item.genre_ids.join(", ")}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width - 86}
        decelerationRate="fast"
        pagingEnabled
        onScrollBeginDrag={handleMovieDeselect}
        style={styles.container}
      />

      {showTrailer && selectedMovie?.video_url && (
        <Modal
          visible={showTrailer}
          transparent={true}
          animationType="fade"
          onRequestClose={closeTrailer}
        >
				<View style={styles.overlay}>
					<Animated.View style={[styles.trailerBox, { opacity }]}>
							<TouchableOpacity style={styles.closeButton} onPress={closeTrailer}>
								<View style={styles.closeButtonCircle}>
									<Icon name="close" size={24} color="#fff" />
								</View>
							</TouchableOpacity>
							<View style={[styles.youtubeWrapper]}>
							<YouTube
								videoId={selectedMovie.video_url}
								height={200}
								width={width} // Explicit width
								play={true}
								webViewProps={{
									allowsFullscreenVideo: true,
									androidLayerType: "hardware",
								}}
								onReady={() => console.log("YouTube video is ready")}
								onChangeState={(state) => console.log("YouTube state:", state)}
								onError={(e) => console.error("YouTube playback error:", e)}
							/>
							</View>
						</Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",  // TODO: should come from a design system token
  },
  movieCard: {
    width: width - 86,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e1e1e",  // TODO: should come from a design system token
  },
  poster: {
    width: width * 0.6,
    height: width * 0.9,
    borderRadius: IMAGE_BORDER_RADIUS,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",  // TODO: should come from a design system token
    marginBottom: 8,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "#ccc",  // TODO: should come from a design system token
    textAlign: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",  // TODO: should come from a design system token
    justifyContent: "center",
    alignItems: "center",
  },
  trailerBox: {
		backgroundColor: "#000",
		top: -20,
    width: width,
    alignItems: "center",
    overflow: "hidden", 
  },
  closeButton: {
    position: "absolute",
    top: 2, 
    right: 2, 
    zIndex: 10,
  },
  closeButtonCircle: {
    backgroundColor: "#000", // TODO: should come from a design system token
		opacity: 0.5,
    borderRadius: 16, 
    width: 30, 
    height: 30, 
    justifyContent: "center", 
    alignItems: "center", 
  },
	youtubeWrapper: {
    borderRadius: IMAGE_BORDER_RADIUS, 
    overflow: "hidden", 
    height: 200,
    alignSelf: "center",
  },
});