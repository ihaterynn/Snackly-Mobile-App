import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import BottomNavbar from './src/components/BottomNavbar'; // Your bottom navbar component
import MealLogScreen from './src/screens/MealLogScreen'; // Import the MealLogScreen

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Create a Stack Navigator

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Bottom tab navigator is the initial screen */}
        <Stack.Screen
          name="BottomNavbar"
          component={BottomNavbar}
          options={{ headerShown: false }} // Hide header for bottom navigation
        />
        
        {/* Add MealLogScreen in the stack for button navigation */}
        <Stack.Screen
          name="MealLogScreen"
          component={MealLogScreen}
          options={{ title: 'Logs' }} // Customize header if necessary
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
