import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Droplet, Thermometer, Sun } from 'lucide-react-native';

const PlantCard = ({ plant, onPress }) => {
  const getStatusColor = (value, type) => {
    if (type === 'humidite') {
      if (value < 30) return styles.red;
      if (value < 50) return styles.yellow;
      return styles.green;
    }
    if (type === 'temperature') {
      if (value < 15 || value > 30) return styles.red;
      if (value < 18 || value > 28) return styles.yellow;
      return styles.green;
    }
    if (type === 'lumiere') {
      if (value < 30) return styles.red;
      if (value < 50) return styles.yellow;
      return styles.green;
    }
  };

  return (
    <View style={styles.card} onTouchEnd={onPress}>
      <View style={styles.header}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantType}>{plant.type}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={styles.status}>
          <Droplet style={[styles.icon, getStatusColor(plant.humidite, 'humidite')]} />
          <Text style={[styles.statusText, getStatusColor(plant.humidite, 'humidite')]}>{plant.humidite}%</Text>
        </View>
        <View style={styles.status}>
          <Thermometer style={[styles.icon, getStatusColor(plant.temperature, 'temperature')]} />
          <Text style={[styles.statusText, getStatusColor(plant.temperature, 'temperature')]}>{plant.temperature}°C</Text>
        </View>
        <View style={styles.status}>
          <Sun style={[styles.icon, getStatusColor(plant.lumiere, 'lumiere')]} />
          <Text style={[styles.statusText, getStatusColor(plant.lumiere, 'lumiere')]}>{plant.lumiere}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  plantType: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
  },
  red: {
    color: 'red',
  },
  yellow: {
    color: 'orange',
  },
  green: {
    color: 'green',
  },
});

export default PlantCard;