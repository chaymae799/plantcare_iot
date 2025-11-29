// API service pour communiquer avec le backend

// ⚠️ IMPORTANT: Mettez à jour cette URL avec votre ngrok actuel!
// Pour obtenir l'URL: lancez "ngrok http 3000" dans un terminal
const NGROK_URL = "https://2b0626f98b28.ngrok-free.app"; // ⚠️ À METTRE À JOUR!

const API_BASE_URL = __DEV__
  ? `${NGROK_URL}/api`
  : "https://your-production-url.com/api";

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
  history?: Array<{
    time: string;
    humidite: number;
    temperature: number;
    lumiere: number;
  }>;
}

export interface Notification {
  id: number;
  type: "success" | "warning" | "danger" | "ml";
  message: string;
  time: string;
  plant?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async fetchWithTimeout(
    url: string,
    options: any = {},
    timeout = 8000
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error(
          "⏱️ Timeout de connexion. Vérifiez que le backend est démarré."
        );
      }
      throw error;
    }
  }

  // GET all plants
  async getPlants(): Promise<Plant[]> {
    const url = `${this.baseUrl}/plants`;
    console.log("🌱 Fetching plants from:", url);

    try {
      const response = await this.fetchWithTimeout(url, { method: "GET" });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Response error:", errorText);
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Plants fetched:", data.length);

      return data.map((plant: any) => ({
        ...plant,
        lastWatered: new Date(plant.lastWatered),
        history: plant.history || [], // S'assurer que history existe
      }));
    } catch (error: any) {
      console.error("❌ Error fetching plants:", error.message);
      throw new Error(
        `Impossible de charger les plantes.\n\nVérifiez:\n1. Backend démarré?\n2. URL ngrok correcte?\n3. Même réseau Wi-Fi?`
      );
    }
  }

  // GET single plant
  async getPlant(id: number): Promise<Plant> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/plants/${id}`
      );

      if (!response.ok) {
        throw new Error("Plante introuvable");
      }

      const data = await response.json();
      return {
        ...data,
        lastWatered: new Date(data.lastWatered),
        history: data.history || [],
      };
    } catch (error) {
      console.error("Error fetching plant:", error);
      throw error;
    }
  }

  // GET sensor data for a plant
  async getSensorData(plantId: number) {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/plants/${plantId}/sensors`
      );

      if (!response.ok) {
        throw new Error("Impossible de charger les capteurs");
      }

      const data = await response.json();
      return {
        current: data.current,
        history: data.history || [],
      };
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      throw error;
    }
  }

  // POST - Water a plant
  async waterPlant(plantId: number): Promise<Plant> {
    try {
      console.log(`💧 Watering plant ${plantId}...`);

      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/plants/${plantId}/water`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Water error:", errorData);
        throw new Error(errorData.message || "Impossible d'arroser la plante");
      }

      const result = await response.json();
      console.log("✅ Plant watered successfully:", result);

      // IMPORTANT: Le serveur retourne { success, message, data: {...plant} }
      if (!result.data) {
        throw new Error("Réponse serveur invalide");
      }

      return {
        ...result.data,
        lastWatered: new Date(result.data.lastWatered),
        history: result.data.history || [],
      };
    } catch (error: any) {
      console.error("❌ Error watering plant:", error);
      throw new Error(
        error.message || "Impossible d'arroser la plante. Réessayez plus tard."
      );
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
      console.log("🌱 Adding new plant:", plantData);

      // Validation côté client
      if (!plantData.name || !plantData.type) {
        throw new Error("Le nom et le type sont requis");
      }

      const response = await this.fetchWithTimeout(`${this.baseUrl}/plants`, {
        method: "POST",
        body: JSON.stringify(plantData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Impossible d'ajouter la plante");
      }

      const data = await response.json();
      console.log("✅ Plant added successfully:", data);

      return {
        ...data,
        lastWatered: new Date(data.lastWatered),
        history: data.history || [],
      };
    } catch (error: any) {
      console.error("❌ Error adding plant:", error);
      throw new Error(
        error.message || "Impossible d'ajouter la plante. Réessayez plus tard."
      );
    }
  }

  // GET notifications
  async getNotifications(): Promise<Notification[]> {
    const url = `${this.baseUrl}/notifications`;

    try {
      const response = await this.fetchWithTimeout(
        url,
        { method: "GET" },
        5000
      );

      if (!response.ok) {
        console.warn("Failed to fetch notifications");
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error fetching notifications:", error.message);
      // Ne pas bloquer l'app si les notifications échouent
      return [];
    }
  }
}

export default new ApiService();
