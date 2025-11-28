import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const AnalyticsScreen = ({
  plants,
  darkMode,
  getDaysSinceWatered,
  settings,
}: any) => {
  const avgHealth = Math.round(
    plants.reduce((a: number, p: any) => a + p.health, 0) / plants.length
  );
  const textColor = darkMode ? "#fff" : "#1f2937";
  const cardBg = darkMode ? "#0b1220" : "#fff";
  const subtextColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={[styles.title, { color: textColor }]}>Statistiques</Text>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Feather name="heart" size={24} color="#10b981" />
        <Text style={[styles.statValue, { color: textColor }]}>
          {avgHealth}%
        </Text>
        <Text style={[styles.statLabel, { color: subtextColor }]}>
          Santé moyenne
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>
          Performance par plante
        </Text>
        {plants.map((p: any) => (
          <View key={p.id} style={styles.performanceRow}>
            <View style={styles.performanceInfo}>
              <Text style={styles.emoji}>{p.image}</Text>
              <Text style={[styles.plantName, { color: textColor }]}>
                {p.name}
              </Text>
            </View>
            <Text
              style={[
                styles.performanceValue,
                { color: p.health > 70 ? "#10b981" : "#f59e0b" },
              ]}
            >
              {p.health}%
            </Text>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    width: "100%",
    marginBottom: 12,
  },
  statValue: { fontSize: 28, fontWeight: "700", marginTop: 8 },
  statLabel: { fontSize: 14, marginTop: 4 },
  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  performanceInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  emoji: { fontSize: 24 },
  plantName: { fontSize: 14, fontWeight: "600" },
  performanceValue: { fontSize: 16, fontWeight: "700" },
});

export default AnalyticsScreen;
