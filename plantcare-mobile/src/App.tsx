import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, Alert } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsModal from "./components/NotificationsModal";
import AddPlantModal from "./components/AddPlantModal";
import NavigationBar from "./components/NavigationBar";
import apiService, { Plant, Notification } from "./services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<string>("home");
  const [selectedPlant, setSelectedPlant] = useState<number>(0);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showAddPlant, setShowAddPlant] = useState<boolean>(false);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoWatering: false,
    humidityThreshold: 30,
    tempMin: 18,
    tempMax: 28,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Timeout de secours
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(
            () =>
              reject(new Error("Timeout: La connexion prend trop de temps")),
            10000
          )
        );

        const plantsData = await Promise.race([
          apiService.getPlants(),
          timeoutPromise,
        ]);

        setPlants(plantsData);

        // Charger les notifications sans bloquer
        const notificationsData = await apiService
          .getNotifications()
          .catch(() => []);
        setNotifications(notificationsData);

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setLoading(false);

        Alert.alert(
          "❌ Erreur de connexion",
          error?.message || "Impossible de se connecter au serveur",
          [
            { text: "Réessayer", onPress: () => fetchData() },
            { text: "Annuler", style: "cancel" },
          ]
        );
      }
    };

    fetchData();

    // Poll for updates every 5 seconds
    const interval = setInterval(async () => {
      try {
        const [plantsData, notificationsData] = await Promise.all([
          apiService.getPlants(),
          apiService.getNotifications(),
        ]);
        setPlants(plantsData);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error polling data:", error);
        // Ne pas afficher d'erreur pour le polling automatique
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const waterPlant = async (plantId: number): Promise<void> => {
    try {
      console.log(`💧 Watering plant ${plantId}...`);

      const updatedPlant = await apiService.waterPlant(plantId);

      // Mettre à jour la liste des plantes
      setPlants((prev) =>
        prev.map((p) => (p.id === plantId ? updatedPlant : p))
      );

      // Rafraîchir les notifications
      const notificationsData = await apiService
        .getNotifications()
        .catch(() => []);
      setNotifications(notificationsData);

      console.log("✅ Plant watered successfully");
    } catch (error: any) {
      console.error("❌ Error watering plant:", error);
      throw error; // Re-throw pour que DetailScreen puisse gérer l'erreur
    }
  };

  const addNewPlant = async (plant: {
    name: string;
    type: string;
    room: string;
    image: string;
    wateringFrequency: number;
  }): Promise<void> => {
    try {
      console.log("🌱 Adding new plant...");

      const newPlant = await apiService.addPlant(plant);

      setPlants((prev) => [...prev, newPlant]);
      setShowAddPlant(false);

      Alert.alert("✅ Succès", `${newPlant.name} a été ajoutée!`);
    } catch (error: any) {
      console.error("❌ Error adding plant:", error);
      Alert.alert(
        "❌ Erreur",
        error.message || "Impossible d'ajouter la plante. Réessayez plus tard."
      );
    }
  };

  const getDaysSinceWatered = (date: Date | string): number => {
    try {
      const lastWatered = new Date(date);
      const days = Math.floor((Date.now() - lastWatered.getTime()) / 86400000);
      return Math.max(0, days); // Ne jamais retourner un nombre négatif
    } catch (error) {
      console.error("Error calculating days:", error);
      return 0;
    }
  };

  // Éviter le crash si plants est vide
  const currentPlant = plants[selectedPlant];

  return (
    <SafeAreaView style={[styles.container, darkMode && styles.containerDark]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <View style={{ flex: 1 }}>
        {currentScreen === "home" && (
          <HomeScreen
            plants={plants}
            settings={settings}
            darkMode={darkMode}
            selectedPlant={selectedPlant}
            setSelectedPlant={setSelectedPlant}
            setCurrentScreen={setCurrentScreen}
            setShowNotifications={setShowNotifications}
            notifications={notifications}
            getDaysSinceWatered={getDaysSinceWatered}
            setShowAddPlant={setShowAddPlant}
          />
        )}
        {currentScreen === "detail" && currentPlant && (
          <DetailScreen
            plant={currentPlant}
            darkMode={darkMode}
            setCurrentScreen={setCurrentScreen}
            waterPlant={waterPlant}
            getDaysSinceWatered={getDaysSinceWatered}
          />
        )}
        {currentScreen === "analytics" && (
          <AnalyticsScreen
            plants={plants}
            darkMode={darkMode}
            getDaysSinceWatered={getDaysSinceWatered}
            settings={settings}
          />
        )}
        {currentScreen === "settings" && (
          <SettingsScreen
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            settings={settings}
            setSettings={setSettings}
          />
        )}
      </View>
      <NavigationBar
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        darkMode={darkMode}
      />
      <NotificationsModal
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        darkMode={darkMode}
      />
      <AddPlantModal
        visible={showAddPlant}
        onClose={() => setShowAddPlant(false)}
        onAddPlant={addNewPlant}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0fdf4" },
  containerDark: { backgroundColor: "#0f172a" },
});
