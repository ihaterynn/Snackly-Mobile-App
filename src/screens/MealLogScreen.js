// MealLogScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const MealLogScreen = ({ route }) => {
  const { logs } = route.params; // Get the logs from navigation params

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Captured Food Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.loggedImage} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  imageContainer: {
    marginBottom: 20,
  },
  loggedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default MealLogScreen;  
