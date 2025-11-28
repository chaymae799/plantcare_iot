import { useState, useEffect } from "react";

type Plant = {
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
  history: any[];
};

type Notification = {
  id: number;
  type: string;
  message: string;
  time: string;
  plant: string | undefined;
};

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch initial plant data from a local source or API
    const initialPlants = [
      {
        id: 1,
        name: "Monstera",
        type: "Tropicale",
        room: "Salon",
        image: "🌿",
        humidite: 45,
        temperature: 24,
        lumiere: 65,
        lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        health: 75,
        wateringFrequency: 7,
        history: [],
      },
      {
        id: 2,
        name: "Cactus",
        type: "Succulente",
        room: "Bureau",
        image: "🌵",
        humidite: 25,
        temperature: 26,
        lumiere: 85,
        lastWatered: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        health: 90,
        wateringFrequency: 21,
        history: [],
      },
      {
        id: 3,
        name: "Fougère",
        type: "Tropicale",
        room: "Salle de bain",
        image: "🪴",
        humidite: 70,
        temperature: 22,
        lumiere: 45,
        lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        health: 85,
        wateringFrequency: 3,
        history: [],
      },
    ];
    setPlants(initialPlants);
  }, []);

  const waterPlant = (plantId: number) => {
    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              humidite: Math.min(100, plant.humidite + 50),
              lastWatered: new Date(),
              health: Math.min(100, plant.health + 5),
            }
          : plant
      )
    );

    const plantName = plants.find((p) => p.id === plantId)?.name;
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "success",
        message: `${plantName} arrosée avec succès!`,
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        plant: plantName,
      },
      ...prev.slice(0, 9),
    ]);
  };

  return {
    plants,
    notifications,
    waterPlant,
  };
};
