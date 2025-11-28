// API service pour communiquer avec le backend

// URL ngrok (obtenue avec: ngrok http 3000)
// ⚠️ IMPORTANT: Si vous redémarrez ngrok, cette URL change!
const NGROK_URL = "https://42cc1439266a.ngrok-free.app"; // ⚠️ Remplacez si ngrok redémarre!

const API_BASE_URL = __DEV__
  ? `${NGROK_URL}/api` // Development - utilise ngrok tunnel
  : "https://your-production-url.com/api"; // Production - à configurer

export interface Plant {
  id: number;
  name: string;
  type: string;
  room: string;
  image: string;
  humidite: number;
  temperature: number;
  lumiere: number;
  lastWatered: string | Date;
  health: number;
  wateringFrequency: number;
  history: Array<{
    time: string;
    humidite: number;
    temperature: number;
    lumiere: number;
  }>;
}

export interface Notification {
  id: number;
  type: "success" | "warning" | "danger";
  message: string;
  time: string;
  plant: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // GET all plants
  async getPlants(): Promise<Plant[]> {
    const url = `${this.baseUrl}/plants`;
    console.log("🌱 Fetching plants from:", url);

    const controller = new AbortController();
    // Réduire le timeout à 5 secondes pour détecter les problèmes plus rapidement
    const timeoutId = setTimeout(() => {
      console.error("⏱️ Timeout après 5 secondes - connexion impossible");
      controller.abort();
    }, 5000); // 5 secondes timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true", // Contourne la page de warning ngrok
        },
        // Ajouter des options pour détecter les erreurs réseau plus rapidement
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      console.log("✅ Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(
          `Failed to fetch plants: ${response.status} ${response.statusText}`
        );
      }

      // Vérifier si la réponse est du JSON (pas la page de warning ngrok)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Réponse n'est pas du JSON:", text.substring(0, 200));
        throw new Error("Réponse invalide du serveur (page de warning ngrok?)");
      }

      const data = await response.json();
      console.log("✅ Plants fetched:", data.length);
      return data.map((plant: any) => ({
        ...plant,
        lastWatered: new Date(plant.lastWatered),
      }));
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError" || error.message.includes("aborted")) {
        console.error("❌ Connection timeout to:", url);
        const baseUrl = this.baseUrl.replace("/api", "");
        throw new Error(
          `⏱️ Timeout de connexion (5s)\n\nVérifiez:\n1. Backend démarré? → http://${baseUrl.replace(
            "http://",
            ""
          )}/api/plants\n2. IP correcte dans api.ts?\n3. Même réseau Wi-Fi?\n4. Firewall autorise port 3000?`
        );
      }
      if (
        error.message.includes("Network request failed") ||
        error.message.includes("Failed to fetch")
      ) {
        console.error("❌ Network error:", error.message);
        const baseUrl = this.baseUrl.replace("/api", "");
        throw new Error(
          `🌐 Erreur réseau\n\nImpossible de se connecter à:\n${baseUrl}\n\nVérifiez:\n1. Backend démarré?\n2. IP correcte: ${baseUrl}\n3. Testez dans Safari: ${baseUrl}/api/plants`
        );
      }
      console.error("❌ Error fetching plants:", error.message);
      throw error;
    }
  }

  // GET single plant
  async getPlant(id: number): Promise<Plant> {
    try {
      const response = await fetch(`${this.baseUrl}/plants/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch plant");
      }
      const data = await response.json();
      return {
        ...data,
        lastWatered: new Date(data.lastWatered),
      };
    } catch (error) {
      console.error("Error fetching plant:", error);
      throw error;
    }
  }

  // GET sensor data for a plant
  async getSensorData(plantId: number) {
    try {
      const response = await fetch(`${this.baseUrl}/plants/${plantId}/sensors`);
      if (!response.ok) {
        throw new Error("Failed to fetch sensor data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      throw error;
    }
  }

  // POST - Water a plant
  async waterPlant(plantId: number): Promise<Plant> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Réduire à 5 secondes

      const response = await fetch(`${this.baseUrl}/plants/${plantId}/water`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Contourne la page de warning ngrok
        },
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to water plant");
      }
      const data = await response.json();
      return {
        ...data.plant,
        lastWatered: new Date(data.plant.lastWatered),
      };
    } catch (error: any) {
      if (error.name === "AbortError" || error.message.includes("aborted")) {
        throw new Error(
          "⏱️ Timeout de connexion. Vérifiez que le backend est démarré."
        );
      }
      console.error("Error watering plant:", error);
      throw error;
    }
  }

  // POST - Add new plant
  async addPlant(plantData: {
    name: string;
    type: string;
    room: string;
    image: string;
    wateringFrequency: number;
  }): Promise<Plant> {
    try {
      const response = await fetch(`${this.baseUrl}/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Contourne la page de warning ngrok
        },
        body: JSON.stringify(plantData),
      });
      if (!response.ok) {
        throw new Error("Failed to add plant");
      }
      const data = await response.json();
      return {
        ...data,
        lastWatered: new Date(data.lastWatered),
      };
    } catch (error) {
      console.error("Error adding plant:", error);
      throw error;
    }
  }

  // GET notifications
  async getNotifications(): Promise<Notification[]> {
    const url = `${this.baseUrl}/notifications`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // Réduire à 5 secondes

      const response = await fetch(url, {
        signal: controller.signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true", // Contourne la page de warning ngrok
        },
        cache: "no-cache",
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return await response.json();
    } catch (error: any) {
      if (error.name === "AbortError" || error.message.includes("aborted")) {
        console.error("❌ Connection timeout to:", url);
        // Ne pas bloquer si les notifications échouent
        return [];
      }
      console.error("Error fetching notifications:", error);
      return []; // Retourner un tableau vide au lieu de throw
    }
  }
}

export default new ApiService();
