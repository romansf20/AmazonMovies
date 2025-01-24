import React from "react";
import { View, Text, Modal, Animated, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import YouTube from "react-native-youtube-iframe";
import { ACTIVE_OPACITY } from "./constants";
import { Movie } from "./types";
import movieCommon from "./movieCommon"; 

const { width } = Dimensions.get("window");

/**
 * VideoPlayerOverlay Component
 * 
 * This component renders a modal overlay containing a YouTube video player 
 * for displaying movie trailers. It provides an immersive experience with 
 * smooth animations and a close button for user interaction.
 * 
 * Props:
 * - videoUrl (string | undefined): The YouTube video ID for the trailer to be played.
 * - showTrailer (boolean): Controls the visibility of the overlay modal.
 * - closeTrailer (function): Callback function to close the trailer overlay.
 * - trailerOpacity (Animated.Value): Controls the opacity animation for the trailer box.
 * 
 * Key Features:
 * - Integrates the `react-native-youtube-iframe` library for YouTube playback.
 * - Supports smooth fade-in and fade-out transitions using React Native's `Animated` API.
 * - Includes a close button styled with a semi-transparent background for usability.
 * - Utilizes responsive design to adapt to different screen widths.
 * 
 * Design Considerations:
 * - Customizable animations for a polished user experience.
 * - Ensures full-screen video playback support via `webViewProps`.
 * - Styled with `StyleSheet` to maintain clean and modular styles.
 * - Adheres to accessibility and usability standards with a focus on intuitive controls.
 * 
 * TODOs:
 * - Extract hardcoded styles like colors and dimensions into a centralized Design System for consistency.
 * - Add localization for error messages and button text.
 */

interface VideoPlayerOverlayProps {
  videoUrl: string | undefined;
  showTrailer: boolean;
  closeTrailer: () => void;
  trailerOpacity: Animated.Value;
	selectedMovie: Movie ;
}

const renderTopDetails = (selectedMovie: Movie) => {
	return (
		<View style={styles.topDetailsWrapper}>
		<Text style={[movieCommon.styles.title, {color: "#bbb"}]}>{selectedMovie?.title}</Text>
		<View style={movieCommon.styles.ratingsContainer}>
			{movieCommon.renderParentalRating(selectedMovie.release_year)}
			{movieCommon.renderParentalRating(selectedMovie.parental_rating)}
			{movieCommon.renderUserRating(selectedMovie.vote_average)}
		</View>
	</View>
	)}

const renderBottomDetails = (selectedMovie: Movie) => {
	return (
		<View style={styles.bottomDetailsWrapper}>
			<Text style={styles.movieDescription}>{selectedMovie?.overview}</Text>
			<Text style={[movieCommon.styles.genres, styles.genres]}>
				<Text style={styles.textLabel}>Genres: </Text>
				{selectedMovie.genres}</Text>
			<Text style={styles.movieText}>
				<Text style={styles.textLabel}>Director: </Text>
				{selectedMovie?.director}</Text>
			<Text style={styles.movieText}>
				<Text style={styles.textLabel}>Cast: </Text>
				{selectedMovie?.cast?.join(", ")}
			</Text>
		</View>
	)}

export const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({
  videoUrl,
  showTrailer,
  closeTrailer,
  trailerOpacity,
	selectedMovie,
}) => {
  return (
    <Modal
      visible={showTrailer}
      transparent={true}
      animationType="fade"
      onRequestClose={closeTrailer}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.trailerBox, { opacity: trailerOpacity }]}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={closeTrailer} 
            activeOpacity={ACTIVE_OPACITY}
          >
            <View style={styles.closeButtonCircle}>
              <Icon name="close" size={24} color="#fff" />
            </View>
					</TouchableOpacity>

					{renderTopDetails(selectedMovie)}
        
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

					{renderBottomDetails(selectedMovie)}

        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.83)", //TODO; this sound eventually come from a Design System token
    justifyContent: "center",
    alignItems: "center",
  },
  trailerBox: {
    backgroundColor: "#000", //TODO; this sound eventually come from a Design System token
    width: width,
    alignItems: "center",
    marginTop: -80,
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 0,
    zIndex: 10,
  },
  closeButtonCircle: {
    backgroundColor: "rgba(0, 0, 0, 0.8)", //TODO; this sound eventually come from a Design System token
    opacity: 0.5,
    borderRadius: 16, //TODO; this sound eventually come from a Design System token
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  youtubeWrapper: {
    overflow: "hidden",
    height: 220,
    alignSelf: "center",
    paddingTop: 12,
  },
	topDetailsWrapper: {
		paddingBottom: 16,
	},

	bottomDetailsWrapper: {
		marginTop: 30,
		width: width * 0.95
	},

	movieDescription: {
		fontFamily: "AmazonEmberRegular",
		fontSize: 15,
		color: "#bbb",
		lineHeight: 19,
		marginBottom: 12,
	},
	textLabel: {
		fontFamily: "AmazonEmberRegular",
		fontSize: 15,
		color: "#999",
	},
	genres: {
		textAlign: "left",
		fontSize: 15,
		marginBottom: 10,
		marginTop: 4, 
	},
	movieText: {
		fontFamily: "AmazonEmberRegular",
		fontSize: 15,
		color: "#bbb",
		marginBottom: 10,
	},
});

const videoPlayerOverlay = {
  VideoPlayerOverlay,
};

export default videoPlayerOverlay;