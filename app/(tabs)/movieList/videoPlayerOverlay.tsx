// VideoPlayerOverlay.tsx
import React from "react";
import { View, Modal, Animated, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import YouTube from "react-native-youtube-iframe";
import { ACTIVE_OPACITY } from "./constants";

const { width } = Dimensions.get("window");

interface VideoPlayerOverlayProps {
  videoUrl: string | undefined;
  showTrailer: boolean;
  closeTrailer: () => void;
  trailerOpacity: Animated.Value;
}

export const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({
  videoUrl,
  showTrailer,
  closeTrailer,
  trailerOpacity,
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
    right: -2,
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
    paddingTop: 14,
  },
});

const videoPlayerOverlay = {
  VideoPlayerOverlay,
};

export default videoPlayerOverlay;