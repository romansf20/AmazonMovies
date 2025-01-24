import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Genre } from "./types";

/**
 * movieCommonStyles Module
 * This Module stores styes that are common to displaying movie details related content
 * and allows to reuse the same styles without duplicating them.
 */

const { width } = Dimensions.get("window");
const POSTER_WIDTH = width * 0.6 * 1.1;

const styles = StyleSheet.create({
	title: {
    width: POSTER_WIDTH, // ensure that title never extends beyond the box-art's width
    fontSize: 20,
    fontFamily: "AmazonEmberDisplayMedium",
    color: "#fff", 
    textAlign: "center",
    marginTop: 16, 
  },
  genres: {
    fontSize: 15,
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

const getGenreNames = (ids: number[], genres: Genre[]): string => {
  return ids
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(", ");
};

const renderUserRating = (voteAverage: number) => (
	<View style={[styles.ratingBadge, styles.userRatingBadge]}>
		<Icon name="star" size={16} color="#FFD700" style={styles.starIcon} />
		<Text style={styles.ratingText}>{voteAverage.toFixed(1)}</Text>
	</View>
);

const renderParentalRating = (parentalRating: string | null | undefined) => (
	<View style={styles.ratingBadge}>
		<Text style={styles.ratingText}>{parentalRating}</Text>
	</View>
);

const movieCommon = {
  styles, renderUserRating, renderParentalRating, getGenreNames
};

export default movieCommon;