export interface Plant {
  id: number;
  name: string;
  type: string;
  room: string;
  image: string;
  humidite: number;
  temperature: number;
  lumiere: number;
  lastWatered: Date;
  health: number;
  wateringFrequency: number;
  history: Array<HistoryEntry>;
}

export interface HistoryEntry {
  time: string;
  humidite: number;
  temperature: number;
  lumiere: number;
}

export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'danger';
  message: string;
  time: string;
  plant: string;
}

export interface Settings {
  notifications: boolean;
  darkMode: boolean;
  autoWatering: boolean;
  language: string;
  tempUnit: 'celsius' | 'fahrenheit';
  humidityThreshold: number;
  tempMin: number;
  tempMax: number;
}
export interface SensorData {
  humidity: number;
  temperature: number;
  light: number;
}