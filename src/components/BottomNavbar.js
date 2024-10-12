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
        headerShown: false, // Hide the header 
        tabBarStyle: {
          backgroundColor: '#fff', // Set background color for the tab bar
          height: 70, 
          paddingBottom: 5, 
        },
        tabBarLabelStyle: {
          fontSize: 13, 
          width: 100, 
        },
        tabBarItemStyle: {
          width: 100, 
          paddingBottom: 6, // Add padding to separate icons and labels
        },
        tabBarIconStyle: {
          marginTop: 12, 
        },
        tabBarActiveTintColor: '#59CE8F', // Active color (when pressed)
        tabBarInactiveTintColor: '#7A7A7A', 
      }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size + 6} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Icon name="camera-alt" color={color} size={size + 6} /> 
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size + 6} /> 
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomNavbar;
