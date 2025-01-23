import React, { useState } from 'react';
import { NavigationContainer, NavigationIndependentTree} from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import DashboardScreen from './index';
import GrowScreen from './grow';
import ProfileScreen from './profile';
import CheckinScreen from './check';

const SELECTED_STATE_COLOR = "#fff"; // TODO: this should live in a Tokens file from Design System

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

const CustomHeader = ({ title }) => (
  <View>
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  </View>
);

const ScreenWithHeader = ({ title, children }) => (
  <View style={styles.screenContainer}>
    <CustomHeader title={title} />
    <View style={styles.screenContent}>
      {children}
    </View>
  </View>
);

const TabNavigator = () => (
  <Tab.Navigator
    tabBarPosition="bottom"
    screenOptions={{
      tabBarStyle: {
				backgroundColor: "#1e1e1e",
        borderTopWidth: 1,
        borderTopColor: '#555',
      },
      tabBarActiveTintColor: SELECTED_STATE_COLOR,
      tabBarInactiveTintColor: '#a1a1a1',
      tabBarIndicatorStyle: {
        backgroundColor: SELECTED_STATE_COLOR,
        height: 1,
        top: 0,
      },
			swipeEnabled: false, // Disable swipe gestures between tab
    }}
  >
		<Tab.Screen
      name="Grow"
      options={{
        tabBarLabel: 'Grow',
        tabBarIcon: ({ color, size }) => (
          <Icon name="trending-up" color={color} size={size} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Grow"><GrowScreen /></ScreenWithHeader>}
    </Tab.Screen>

    <Tab.Screen
      name="Check-in"
      options={{
        tabBarLabel: 'Check-in',
        tabBarIcon: ({ color, size }) => (
          <Icon name="how-to-reg" color={color} size={size} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Check-in"><CheckinScreen /></ScreenWithHeader>}
    </Tab.Screen>
		<Tab.Screen
      name="Dashboard"
      options={{
        tabBarLabel: 'Dash',
        tabBarIcon: ({ color, size }) => (
          <Icon name="bar-chart" color={color} size={size} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Dashboard"><DashboardScreen /></ScreenWithHeader>}
    </Tab.Screen>
    
    <Tab.Screen
      name="Profile"
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <Icon name="person" color={color} size={size} />
        ),
      }}
    >
      {() => <ScreenWithHeader title="Profile"><ProfileScreen /></ScreenWithHeader>}
    </Tab.Screen>
  </Tab.Navigator>
);

const AppLayout = () => {


  return (
		<NavigationIndependentTree>
			<NavigationContainer>
				
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Main" component={TabNavigator} />
					</Stack.Navigator>
				
			</NavigationContainer>
		</NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#1e1e1e',
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
    backgroundColor: '#f1f1f5',
  },
  screenContent: {
    flex: 1,
  },
});

export default AppLayout;
