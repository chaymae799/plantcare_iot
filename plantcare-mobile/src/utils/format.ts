// This file contains utility functions for formatting data, such as dates or numbers.

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatHumidity = (humidity: number): string => {
  return `${humidity.toFixed(1)}%`;
};

export const formatTemperature = (temperature: number): string => {
  return `${temperature.toFixed(1)}°C`;
};

export const formatLight = (light: number): string => {
  return `${light.toFixed(1)}%`;
};