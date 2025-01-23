import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SearchScreen() {
  return (
    <View style={styles.container}>
			<Text style={styles.title}>Search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		backgroundColor: "#1e1e1e",
    justifyContent: 'center', // Center vertically
    alignItems: 'center',    // Center horizontally
  },
  title: {
		fontSize: 26,
		color: '#fff'
  },
});
