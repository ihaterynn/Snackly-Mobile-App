import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const MealLogScreen = ({ route }) => {
  const { logs } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.logContainer}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.imageUri }} style={styles.loggedImage} />
            </View>
            <View style={styles.nutrientContainer}>
              <Text style={styles.foodNameText}>
                {item.predictedFood ? item.predictedFood : 'Unknown Food'}
              </Text>
              <Text style={styles.nutrientText}>
                Calories: {item.calories ? item.calories.toFixed(2) : 'N/A'}
              </Text>
              <Text style={styles.nutrientText}>
                Carbs: {item.carbs ? item.carbs.toFixed(2) : 'N/A'}g
              </Text>
              <Text style={styles.nutrientText}>
                Protein: {item.protein ? item.protein.toFixed(2) : 'N/A'}g
              </Text>
              <Text style={styles.nutrientText}>
                Fats: {item.fats ? item.fats.toFixed(2) : 'N/A'}g
              </Text>
            </View>
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
  logContainer: {
    flexDirection: 'row', 
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '40%',
  },
  loggedImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  nutrientContainer: {
    width: '50%',
    justifyContent: 'center',
  },
  foodNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  nutrientText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});

export default MealLogScreen;
