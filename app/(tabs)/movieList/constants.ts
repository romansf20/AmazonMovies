import { Dimensions } from "react-native";

/**
 * Constants Module
 * 
 * This module defines global constants used across the application.
 * It includes reusable values like `ACTIVE_OPACITY` for button touch opacity 
 * to ensure UX behavior consistency and maintainability in the UI's interactive behavior.
 */

const { width } = Dimensions.get("window");
export const ACTIVE_OPACITY = 0.5; // define custom opacity for all the buttons' down state that use TouchableOpacity
export const POSTER_WIDTH = width * 0.6 * 1.1;
export const POSTER_HEIGHT = width * 0.9 * 1.1;

const constants = {
  ACTIVE_OPACITY, POSTER_WIDTH, POSTER_HEIGHT
};

export default constants;