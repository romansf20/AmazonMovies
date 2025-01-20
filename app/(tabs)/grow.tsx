import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import axios from "axios";
import { Video } from "react-native-video";

const SCREEN_WIDTH = Dimensions.get('window').width;

const tabWidth = 60;
const horizGap = 20;

export default function GrowScreen() {
  const [activeTab, setActiveTab] = useState('Calm');
  const underlinePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate underline position
    Animated.timing(underlinePosition, {
      toValue: activeTab === 'Calm' ? 0 : tabWidth + horizGap,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <Image
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('@/assets/images/grow.png')}
        style={styles.headerImage}
      />

     
    </View>
  );
}

const SELECTED_STATE_COLOR = "#54487f";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    height: 376,
    marginTop: 0,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -10,
    marginTop: -26,
    // position: 'relative', // Needed for absolute positioning of the underline
    // width: '100%',
  },
  breathingAnimationContainer: {
    marginTop: 20,
  },
  tab: {
    // flex: 1,
    paddingVertical: 10,
		paddingHorizontal: horizGap,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  activeTabText: {
    color: 'black',
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
		left: 8,
    height: 2,
    width: tabWidth,
    backgroundColor: SELECTED_STATE_COLOR,
  },
});
