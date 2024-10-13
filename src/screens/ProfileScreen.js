import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Svg, { Circle } from 'react-native-svg';

const Profile = () => {
  const [weight, setWeight] = useState(50);  // User's weight in kg
  const [height, setHeight] = useState(160); // User's height in cm
  const [goal, setGoal] = useState('maintain'); // User's goal ('maintain', 'bulk', 'cut')
  const [calories, setCalories] = useState(1999);  // Calculated calorie goal
  const [profileImage, setProfileImage] = useState(null); // Profile image URI

  // Harris-Benedict Equation for Calorie Intake Calculation
  const calculateCalories = () => {
    let bmr = 10 * weight + 6.25 * height - 5 * 25 + 5; // Assuming age 25 and male
    if (goal === 'bulk') {
      setCalories(bmr * 1.2 + 500); // Add extra for bulking
    } else if (goal === 'cut') {
      setCalories(bmr * 1.2 - 500); // Subtract for cutting
    } else {
      setCalories(bmr * 1.2); // Maintain calories
    }
  };

  // Update the calories whenever weight, height, or goal changes
  React.useEffect(() => {
    calculateCalories();
  }, [weight, height, goal]);

  // Function to handle image selection
  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorMessage && response.assets) {
        setProfileImage(response.assets[0].uri); // Set profile image URI
      } else {
        Alert.alert('Error', 'Could not select an image');
      }
    });
  };

  // Function to handle camera
  const handleCamera = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (!response.didCancel && !response.errorMessage && response.assets) {
        setProfileImage(response.assets[0].uri); // Set profile image URI
      } else {
        Alert.alert('Error', 'Could not take a photo');
      }
    });
  };

  const handleSave = () => {
    Alert.alert('Success', 'Your changes have been saved and calorie goal updated!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Blue Section */}
      <View style={styles.topSection}>
        <View style={styles.profileHeader}>
          {/* Profile Image */}
          <TouchableOpacity onPress={handleImagePicker}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Image source={require('../../assets/bread.png')} style={styles.profileImage} />
            )}
          </TouchableOpacity>

          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>rynn</Text>
            <Text style={styles.caloriesText}>{calories.toFixed(0)} Cal / d</Text>
          </View>
        </View>
      </View>

      {/* Editable Inputs Section */}
      <View style={styles.inputSection}>
        {/* Weight Input */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight.toString()}
            keyboardType="numeric"
            onChangeText={(value) => setWeight(parseFloat(value))}
          />
        </View>

        {/* Height Input */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height.toString()}
            keyboardType="numeric"
            onChangeText={(value) => setHeight(parseFloat(value))}
          />
        </View>

        {/* Goals Input */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Goal</Text>
          <TouchableOpacity
            style={[
              styles.goalButton,
              goal === 'maintain' && styles.activeGoalButton,
            ]}
            onPress={() => setGoal('maintain')}
          >
            <Text style={styles.goalButtonText}>Maintenance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalButton,
              goal === 'bulk' && styles.activeGoalButton,
            ]}
            onPress={() => setGoal('bulk')}
          >
            <Text style={styles.goalButtonText}>Bulk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.goalButton,
              goal === 'cut' && styles.activeGoalButton,
            ]}
            onPress={() => setGoal('cut')}
          >
            <Text style={styles.goalButtonText}>Cut</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save and Update Calorie Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
  },
  topSection: {
    backgroundColor: '#DAF5FF',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileDetails: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  caloriesText: {
    fontSize: 16,
    color: '#333',
  },
  inputSection: {
    padding: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    flex: 1,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    width: '30%',
    textAlign: 'center',
  },
  goalButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  activeGoalButton: {
    backgroundColor: '#3C3F4D',
    borderColor: '#3C3F4D',
  },
  goalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3C3F4D',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Profile;
