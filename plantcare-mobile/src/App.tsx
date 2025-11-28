import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar, Alert } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsModal from "./components/NotificationsModal";
import AddPlantModal from "./components/AddPlantModal";
import NavigationBar from "./components/NavigationBar";
import apiService, { Plant } from "./services/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedPlant, setSelectedPlant] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddPlant, setShowAddPlant] = useState(false);

  const [plants, setPlants] = useState<Plant[]>([]);

  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: "success" | "warning" | "danger";
    message: string;
    time: string;
    plant: string;
  }>>([]);

  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoWatering: false,
    humidityThreshold: 30,
    tempMin: 18,
    tempMax: 28,
  });

  // Fetch initial data and set up polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Timeout de secours pour éviter que l'app reste bloquée
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout: La connexion prend trop de temps")), 10000)
        );
        
        const [plantsData, notificationsData] = await Promise.all([
          Promise.race([apiService.getPlants(), timeoutPromise]) as Promise<Plant[]>,
          apiService.getNotifications().catch(() => []), // Ne pas bloquer si notifications échouent
        ]);
        setPlants(plantsData);
        setNotifications(notificationsData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        const errorMessage = error?.message || "Erreur inconnue";
        Alert.alert(
          "Erreur de connexion",
          `${errorMessage}\n\nVérifications:\n1. Backend démarré? (cd backend && npm start)\n2. ngrok tourne? (ngrok http 3000)\n3. URL ngrok correcte dans api.ts?\n4. Testez dans Safari: https://2a4f7a5fe0fe.ngrok-free.app/api/plants`,
          [{ text: "OK", onPress: () => setLoading(false) }]
        );
        // S'assurer que le loading se termine même si l'alert est ignorée
        setLoading(false);
      } finally {
        // Double sécurité pour s'assurer que loading se termine
        setTimeout(() => setLoading(false), 500);
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
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const waterPlant = async (plantId: number) => {
    try {
      const updatedPlant = await apiService.waterPlant(plantId);
      setPlants((prev) =>
        prev.map((p) => (p.id === plantId ? updatedPlant : p))
      );
      
      // Refresh notifications
      const notificationsData = await apiService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error watering plant:", error);
      Alert.alert("Erreur", "Impossible d'arroser la plante. Réessayez plus tard.");
    }
  };

  const addNewPlant = async (data: any) => {
    try {
      const newPlant = await apiService.addPlant(data);
      setPlants((prev) => [...prev, newPlant]);
      setShowAddPlant(false);
    } catch (error) {
      console.error("Error adding plant:", error);
      Alert.alert("Erreur", "Impossible d'ajouter la plante. Réessayez plus tard.");
    }
  };

  const getDaysSinceWatered = (date: any) =>
    Math.floor((Date.now() - new Date(date).getTime()) / 86400000);

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
        {currentScreen === "detail" && plants[selectedPlant] && (
          <DetailScreen
            plant={plants[selectedPlant]}
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
