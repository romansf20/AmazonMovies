import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import axios from "axios";
import Config from "react-native-config";
import WebView from "react-native-webview";

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_WIDTH = 150;
const POSTER_HEIGHT = 225;

export default function GrowScreen() {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);

  const fetchMovies = async () => {
    try {
      const baseUrl = 'https://api.themoviedb.org/3';
      const apiKey = Config.REACT_APP_TMDB_KEY; // Replace with your API key
      const response = await axios.get(baseUrl + '/discover/movie', {
        params: {
          sort_by: 'popularity.desc',
          api_key: apiKey,
        },
      });

      const movieData = await Promise.all(
        response.data.results.map(async (movie) => {
          const trailerResponse = await axios.get(`${baseUrl}/movie/${movie.id}/videos`, {
            params: { api_key: apiKey },
          });
          const trailer = trailerResponse.data.results.find(video => video.type === 'Trailer');

          return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            poster: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
            trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null, // Embed URL for YouTube
          };
        })
      );

      setMovies(movieData);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image source={{ uri: item.poster }} style={styles.poster} />
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.overview}>{item.overview}</Text>
              {item.trailer && (
                <TouchableOpacity onPress={() => setTrailerUrl(item.trailer)}>
                  <Text style={styles.trailerLink}>Watch Trailer</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />

      {/* Modal for Trailer */}
      {trailerUrl && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={!!trailerUrl}
          onRequestClose={() => setTrailerUrl(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <WebView
                source={{ uri: trailerUrl }}
                style={styles.webview}
              />
              <TouchableOpacity onPress={() => setTrailerUrl(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  movieCard: {
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  movieInfo: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  trailerLink: {
    fontSize: 14,
    color: '#1e90ff',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.6,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#1e90ff',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
