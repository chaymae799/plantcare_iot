import { SensorData } from '../types';

const sensors = {
  getHumidity: (plantId: number): number => {
    // Simulate humidity data for a plant
    return Math.random() * 100; // Returns a random humidity percentage
  },
  
  getTemperature: (plantId: number): number => {
    // Simulate temperature data for a plant
    return 15 + Math.random() * 15; // Returns a random temperature between 15°C and 30°C
  },
  
  getLight: (plantId: number): number => {
    // Simulate light data for a plant
    return Math.random() * 100; // Returns a random light percentage
  },
  
  getSensorData: (plantId: number): SensorData => {
    return {
      humidity: sensors.getHumidity(plantId),
      temperature: sensors.getTemperature(plantId),
      light: sensors.getLight(plantId),
    };
  },
};

export default sensors;