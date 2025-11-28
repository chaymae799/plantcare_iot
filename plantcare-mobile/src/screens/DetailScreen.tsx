import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

const screenW = Dimensions.get("window").width - 32;

const DetailScreen = ({
  plant,
  darkMode,
  setCurrentScreen,
  waterPlant,
  getDaysSinceWatered,
}: any) => {
  const textColor = darkMode ? "#fff" : "#1f2937";
  const cardBg = darkMode ? "#0b1220" : "#fff";
  const subtextColor = darkMode ? "#9ca3af" : "#6b7280";
  const chartBg = darkMode ? "#1f2937" : "#fff";

  const chartData = plant.history.slice(-10);

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          onPress={() => setCurrentScreen("home")}
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={24} color={textColor} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: textColor }]}>{plant.name}</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            {plant.type}
          </Text>
        </View>
        <Text style={styles.largeEmoji}>{plant.image}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>
          Évolution de l'humidité
        </Text>
        {chartData.length > 0 ? (
          <LineChart
            data={{
              labels: chartData.map((d: any) => d.time),
              datasets: [{ data: chartData.map((d: any) => d.humidite) }],
            }}
            width={screenW}
            height={200}
            chartConfig={{
              backgroundGradientFrom: chartBg,
              backgroundGradientTo: chartBg,
              decimalPlaces: 1,
              color: () => "#3b82f6",
              labelColor: () => subtextColor,
              style: { borderRadius: 16 },
            }}
            bezier
          />
        ) : (
          <Text
            style={[styles.subtitle, { color: subtextColor, marginTop: 10 }]}
          >
            Pas encore de données
          </Text>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <View style={styles.sensorRow}>
          <View style={styles.sensorBlock}>
            <MaterialCommunityIcons name="water" size={24} color="#3b82f6" />
            <Text style={[styles.sensorLabel, { color: subtextColor }]}>
              Humidité
            </Text>
            <Text style={[styles.sensorValue, { color: textColor }]}>
              {plant.humidite}%
            </Text>
          </View>
          <View style={styles.sensorBlock}>
            <Feather name="thermometer" size={24} color="#f97316" />
            <Text style={[styles.sensorLabel, { color: subtextColor }]}>
              Température
            </Text>
            <Text style={[styles.sensorValue, { color: textColor }]}>
              {plant.temperature}°C
            </Text>
          </View>
          <View style={styles.sensorBlock}>
            <Feather name="sun" size={24} color="#f59e0b" />
            <Text style={[styles.sensorLabel, { color: subtextColor }]}>
              Lumière
            </Text>
            <Text style={[styles.sensorValue, { color: textColor }]}>
              {plant.lumiere}%
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>
          Informations
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: subtextColor }]}>
            Dernier arrosage
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            {getDaysSinceWatered(plant.lastWatered)} jour(s)
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: subtextColor }]}>
            Fréquence
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            Tous les {plant.wateringFrequency} jours
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: subtextColor }]}>
            Emplacement
          </Text>
          <Text style={[styles.infoValue, { color: textColor }]}>
            {plant.room}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.waterBtn}
        onPress={() => waterPlant(plant.id)}
      >
        <Feather name="droplet" size={18} color="#fff" />
        <Text style={styles.waterBtnText}>Arroser maintenant</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  backBtn: { padding: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 2 },
  largeEmoji: { fontSize: 48 },
  card: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  sensorRow: { flexDirection: "row", justifyContent: "space-around" },
  sensorBlock: { alignItems: "center" },
  sensorLabel: { fontSize: 12, marginTop: 8 },
  sensorValue: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  waterBtn: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  waterBtnText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default DetailScreen;
