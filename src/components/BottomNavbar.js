import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the header if you don't need it
        tabBarStyle: {
          backgroundColor: '#fff', // Set background color for the tab bar
          height: 70, // Set the height of the tab bar
          paddingBottom: 5, // Add padding to the bottom for better spacing
        },
        tabBarLabelStyle: {
          fontSize: 13, // Set label font size
          width: 100, // Set width of each label item
        },
        tabBarItemStyle: {
          width: 100, // Set width of each tab item
          paddingBottom: 6, // Add padding to separate icons and labels
        },
        tabBarIconStyle: {
          marginTop: 12, // Move the icons down slightly
        },
        tabBarActiveTintColor: '#59CE8F', // Active color (when pressed)
        tabBarInactiveTintColor: '#7A7A7A', // Inactive color (default state)
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size + 6} /> // Keep icon size unchanged
          ),
        }} 
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera-alt" color={color} size={size + 6} /> // Keep icon size unchanged
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile', // Ensure full label is displayed
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size + 6} /> // Keep icon size unchanged
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomNavbar;
