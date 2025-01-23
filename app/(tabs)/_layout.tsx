import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

// Import screens
import HomeScreen from './movieList/movieList';
import ProfileScreen from './profile';
import SearchScreen from './Search';

const SELECTED_STATE_COLOR = "#fff";
const BACKGROUND_COLOR = "#1e1e1e";
const ICON_SIZE_OFFSET = 4;
const FOOTER_PADDING = 70;
const TAB_SELECTED_LINE_WIDTH = 50;

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Define the prop types
interface CustomHeaderProps {
  title: string;
}

interface ScreenWithHeaderProps {
  title: string;
  children: React.ReactNode; // Accepts any valid React node
}

// Functional component with typed props
const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => (
  <View>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  </View>
);

const ScreenWithHeader: React.FC<ScreenWithHeaderProps> = ({ title, children }) => (
  <View style={styles.screenContainer}>
    <CustomHeader title={title} />
    <View style={styles.screenContent}>{children}</View>
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    tabBarPosition="bottom"
    screenOptions={{
      tabBarStyle: {
        backgroundColor: BACKGROUND_COLOR,
        borderTopWidth: 1,
        borderTopColor: '#555',
        position: 'absolute',
        bottom: 4,
        left: 0,
        right: 0,
        height: FOOTER_PADDING,
      },
      tabBarActiveTintColor: SELECTED_STATE_COLOR,
      tabBarInactiveTintColor: '#a1a1a1',
      tabBarIndicatorStyle: {
        backgroundColor: SELECTED_STATE_COLOR,
				width: TAB_SELECTED_LINE_WIDTH,
				marginLeft: (Dimensions.get('window').width / 3 - TAB_SELECTED_LINE_WIDTH) / 2,
        height: 1,
        top: 0,
      },
      swipeEnabled: false,
      tabBarLabelStyle: {
        fontSize: 12,
        marginTop: 0,
      },
    }}
  >
    <Tab.Screen
      name="Home"
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Icon name="home" color={color} size={size - ICON_SIZE_OFFSET} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Grow"><HomeScreen /></ScreenWithHeader>}
    </Tab.Screen>

    <Tab.Screen
      name="Search"
      options={{
        tabBarLabel: 'Search',
        tabBarIcon: ({ color, size }) => (
          <Icon name="search" color={color} size={size - ICON_SIZE_OFFSET} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Search"><SearchScreen /></ScreenWithHeader>}
    </Tab.Screen>

    <Tab.Screen
      name="Profile"
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size - ICON_SIZE_OFFSET} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Profile"><ProfileScreen /></ScreenWithHeader>}
    </Tab.Screen>
  </Tab.Navigator>
);

const AppLayout = () => (
  <NavigationIndependentTree>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  </NavigationIndependentTree>
);

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingBottom: FOOTER_PADDING,
  },
  screenContent: {
    flex: 1,
  },
});

export default AppLayout;
