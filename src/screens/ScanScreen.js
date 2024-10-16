import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Svg, { Circle } from 'react-native-svg';
import RNFS from 'react-native-fs'; 
import { PermissionsAndroid, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const ScanScreen = () => {
  const [carbs, setCarbs] = useState(0); 
  const [protein, setProtein] = useState(0); 
  const [fats, setFats] = useState(0); 
  const [caloriesEaten, setCaloriesEaten] = useState(0); 
  const [predictedFood, setPredictedFood] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [logs, setLogs] = useState([]); 
  const [totalCalories, setTotalCalories] = useState(2000);  // Default to 2000

  const navigation = useNavigation(); // For navigation

  // Fetch updated daily calories from AsyncStorage when screen gains focus
  const fetchDailyCalories = async () => {
    try {
      const storedCalories = await AsyncStorage.getItem('dailyCalories');
      if (storedCalories !== null) {
        setTotalCalories(parseFloat(storedCalories));  // Update state with stored calories
      }
    } catch (error) {
      console.error("Error fetching daily calories: ", error);
    }
  };

  // Use useFocusEffect to fetch updated calories whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDailyCalories();
    }, [])
  );

  const progress = Math.min((caloriesEaten / totalCalories) * 100, 100); // Cap the progress at 100%

  async function requestPermissions() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      if (
        granted['android.permission.CAMERA'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.READ_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED ||
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Error', 'Camera and storage permissions are required.');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  const getProgressColor = (progress) => {
    if (progress <= 50) {
      const red = 255;
      const green = Math.floor((progress / 50) * 255);
      return `rgb(${red},${green},0)`; 
    } else {
      const red = Math.floor(255 - ((progress - 50) / 50) * 255);
      const green = 255;
      return `rgb(${red},${green},0)`; 
    }
  };
  
  const handleImageSelection = (response) => {
    if (!response.didCancel && !response.errorMessage && response.assets && response.assets[0]) {
      const { uri } = response.assets[0]; 
      inferImage(uri);
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, handleImageSelection);
  };

  const handleCamera = () => {
    console.log('Launching Camera...');
    launchCamera({ mediaType: 'photo' }, (response) => {
      console.log('Camera Response: ', response);
      
      if (!response.didCancel && !response.errorMessage && response.assets && response.assets[0]) {
        const { uri } = response.assets[0]; 
        inferImage(uri); // Call the inferImage function with the captured image URI
      } else {
        console.error('Camera error: ', response.errorMessage || 'User cancelled image capture');
      }
    });
  };
  

  const inferImage = async (imgUri) => {
    try {
      setLoading(true); 
      const formData = new FormData();
      formData.append('image', {
        uri: imgUri,
        type: 'image/jpeg',
        name: 'food_image.jpg',
      });
      
      const urls = [
        'http://192.168.0.5:5000/infer',
        'http://172.18.74.133:5000/infer'
      ];
  
      let response = null;
      for (const url of urls) {
        try {
          console.log(`Attempting to fetch from ${url}...`);
          response = await fetch(url, {
            method: 'POST',
            body: formData,
          });
  
          if (response.ok) {
            break; // If the fetch was successful, break out of the loop
          } else {
            console.error(`Error fetching from ${url}: `, response.status);
          }
        } catch (error) {
          console.error(`Error attempting to fetch from ${url}:`, error);
        }
      }
  
      if (response && response.ok) {
        const result = await response.json();
        console.log('Inference Result:', result);
  
        if (result && result['Estimated Nutrition Info']) {
          const nutrition = result['Estimated Nutrition Info'];
  
          // Accumulate the nutrition values
          setCaloriesEaten(prevCalories => prevCalories + nutrition.calories);
          setCarbs(prevCarbs => prevCarbs + nutrition.carbs);
          setProtein(prevProtein => prevProtein + nutrition.protein);
          setFats(prevFats => prevFats + nutrition.fat);
          setPredictedFood(result['Predicted Food']); 
  
          // Add to logs
          setLogs([...logs, {
            imageUri: imgUri,
            predictedFood: result['Predicted Food'],
            calories: nutrition.calories,
            carbs: nutrition.carbs,
            protein: nutrition.protein,
            fats: nutrition.fat
          }]);
        } else {
          console.error('Error: Could not retrieve nutrition information.');
          Alert.alert('Error', 'Could not retrieve nutrition information.');
        }
      } else {
        Alert.alert('Error', 'Failed to fetch data from all servers.');
      }
    } catch (error) {
      console.error('Error during inference: ', error);
      Alert.alert('Error', 'Failed to send image to the server.');
    } finally {
      setLoading(false);
    }
  };
  

  
  // Navigation to MealLogScreen
  const handleLogsNavigation = () => {
    navigation.navigate('MealLogScreen', { logs });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.circleContainer}>
          <Svg height={120} width={120}>
            <Circle
              stroke="#e0e0e0"
              fill="transparent"
              strokeWidth={10}
              r={50}
              cx={60}
              cy={60}
            />
            <Circle
              stroke={getProgressColor(progress)}
              fill="transparent"
              strokeWidth={10}
              strokeDasharray={`${Math.PI * 100}`}
              strokeDashoffset={`${Math.PI * 100 - (progress / 100) * Math.PI * 100}`}
              r={50}
              cx={60}
              cy={60}
            />
          </Svg>
          <Text style={styles.circleText}>{caloriesEaten.toFixed(2)}</Text>
          <Text style={styles.circleLabel}>Calories</Text>
        </View>

        <View style={styles.nutrientInfo}>
          <View style={styles.nutrientRow}>
            <Image source={require('../../assets/bread.png')} style={styles.icon} />
            <Text style={styles.nutrientValue}>{carbs.toFixed(2)}g</Text>
          </View>
          <View style={styles.nutrientRow}>
            <Image source={require('../../assets/steak.png')} style={styles.icon} />
            <Text style={styles.nutrientValue}>{protein.toFixed(2)}g</Text>
          </View>
          <View style={styles.nutrientRow}>
            <Image source={require('../../assets/milk2.png')} style={styles.icon} />
            <Text style={styles.nutrientValue}>{fats.toFixed(2)}g</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>Scan Food</Text>

        <TouchableOpacity style={styles.selectButton} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Select an image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.snapButton} onPress={handleCamera}>
          <Text style={styles.buttonText}>Snap a photo</Text>
        </TouchableOpacity>

        {/* Navigate to MealLogScreen */}
        <TouchableOpacity style={styles.logsButton} onPress={handleLogsNavigation}>
          <Text style={styles.buttonText}>View Logs</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  topSection: {
    height: 210,
    backgroundColor: '#DAF5FF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  circleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 35,
  },
  circleText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    top: 35,
  },
  circleLabel: {
    position: 'absolute',
    top: 60,
    fontSize: 16,
    color: '#666',
    width: 60,
  },
  nutrientInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 25,
  },
  nutrientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15, 
    marginLeft: -20,
  },
  icon: {
    width: 40,
    height: 45,
    marginRight: 15,
  },
  nutrientValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#3C3F4D',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: 150,
  },
  snapButton: {
    backgroundColor: '#3C3F4D',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: 150,
  },
  logsButton: {
    backgroundColor: '#3C3F4D',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    width: 150,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ScanScreen;