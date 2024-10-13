import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import your custom images
import homeIcon from '../../assets/home.png';
import scanIcon from '../../assets/camera.png';
import profileIcon from '../../assets/profile2.png';

const Tab = createBottomTabNavigator();

const BottomNavbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the header
        tabBarStyle: {
          backgroundColor: '#fff', // Set background color for the tab bar
          height: 70,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarItemStyle: {
          paddingBottom: 6, // Add padding to separate icons and labels
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        tabBarActiveTintColor: '#59CE8F', // Active color (when pressed)
        tabBarInactiveTintColor: '#7A7A7A',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image source={homeIcon} style={{ tintColor: color, width: size + 5, height: size + 5 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Image source={scanIcon} style={{ tintColor: color, width: size + 6, height: size + 6 }} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Image source={profileIcon} style={{ tintColor: color, width: size + 4, height: size + 4 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavbar;
