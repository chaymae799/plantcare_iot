import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = ({
  plants,
  settings,
  darkMode,
  selectedPlant,
  setSelectedPlant,
  setCurrentScreen,
  setShowNotifications,
  notifications,
  getDaysSinceWatered,
  setShowAddPlant,
}: any) => {
  const avgHum = Math.round(
    plants.reduce((a: number, p: any) => a + p.humidite, 0) / plants.length
  );
  const avgHealth = Math.round(
    plants.reduce((a: number, p: any) => a + p.health, 0) / plants.length
  );

  const textColor = darkMode ? "#fff" : "#1f2937";
  const cardBg = darkMode ? "#0b1220" : "#fff";
  const subtextColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>Mes Plantes</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            {plants.length} plantes actives
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowNotifications(true)}
          style={styles.bellBtn}
        >
          <Feather name="bell" size={20} color="#fff" />
          {notifications.some((n: any) => n.type === "danger") && (
            <View style={styles.badge} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: cardBg }]}>
          <MaterialCommunityIcons name="water" size={20} color="#3b82f6" />
          <Text style={[styles.statValue, { color: textColor }]}>
            {avgHum}%
          </Text>
          <Text style={[styles.statLabel, { color: subtextColor }]}>
            Humidité moy.
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: cardBg }]}>
          <Feather name="heart" size={20} color="#10b981" />
          <Text style={[styles.statValue, { color: textColor }]}>
            {avgHealth}%
          </Text>
          <Text style={[styles.statLabel, { color: subtextColor }]}>Santé</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: cardBg }]}>
          <Feather name="alert-triangle" size={20} color="#f59e0b" />
          <Text style={[styles.statValue, { color: textColor }]}>
            {
              plants.filter((p: any) => p.humidite < settings.humidityThreshold)
                .length
            }
          </Text>
          <Text style={[styles.statLabel, { color: subtextColor }]}>
            Alertes
          </Text>
        </View>
      </View>

      <FlatList
        data={plants}
        keyExtractor={(item: any) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item, index }: any) => {
          const days = getDaysSinceWatered(item.lastWatered);
          const needsWater = days >= item.wateringFrequency;
          return (
            <TouchableOpacity
              style={[styles.plantCard, { backgroundColor: cardBg }]}
              onPress={() => {
                setSelectedPlant(index);
                setCurrentScreen("detail");
              }}
            >
              <Text style={styles.plantEmoji}>{item.image}</Text>
              <View style={{ flex: 1 }}>
                <View style={styles.cardRow}>
                  <View>
                    <Text style={[styles.plantName, { color: textColor }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.plantType, { color: subtextColor }]}>
                      {item.type} • {item.room}
                    </Text>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color={subtextColor}
                  />
                </View>

                <View style={styles.indicators}>
                  <View style={styles.indicator}>
                    <MaterialCommunityIcons
                      name="water"
                      size={16}
                      color="#3b82f6"
                    />
                    <Text style={[styles.indicatorText, { color: textColor }]}>
                      {item.humidite}%
                    </Text>
                  </View>
                  <View style={styles.indicator}>
                    <Feather name="thermometer" size={16} color="#f97316" />
                    <Text style={[styles.indicatorText, { color: textColor }]}>
                      {item.temperature}°C
                    </Text>
                  </View>
                  <View style={styles.indicator}>
                    <Feather name="sun" size={16} color="#f59e0b" />
                    <Text style={[styles.indicatorText, { color: textColor }]}>
                      {item.lumiere}%
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.healthBar,
                    { backgroundColor: darkMode ? "#1f2937" : "#e5e7eb" },
                  ]}
                >
                  <View
                    style={[
                      styles.healthFill,
                      {
                        width: `${item.health}%`,
                        backgroundColor:
                          item.health > 70
                            ? "#10b981"
                            : item.health > 40
                            ? "#f59e0b"
                            : "#ef4444",
                      },
                    ]}
                  />
                </View>

                {needsWater && (
                  <View style={styles.alertRow}>
                    <Feather name="clock" size={14} color="#f97316" />
                    <Text style={styles.alertText}>
                      Arroser maintenant! ({days} jours)
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowAddPlant(true)}
      >
        <Feather name="plus-circle" size={18} color="#fff" />
        <Text style={styles.addBtnText}>Ajouter une plante</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "700" },
  subtitle: { fontSize: 14, marginTop: 2 },
  bellBtn: { backgroundColor: "#10b981", padding: 10, borderRadius: 24 },
  badge: {
    width: 10,
    height: 10,
    backgroundColor: "#ef4444",
    borderRadius: 5,
    position: "absolute",
    right: 4,
    top: 4,
  },
  statsRow: { flexDirection: "row", marginBottom: 20, gap: 10 },
  statCard: { flex: 1, padding: 12, borderRadius: 12, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", marginTop: 6 },
  statLabel: { fontSize: 11, marginTop: 2 },
  plantCard: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
  },
  plantEmoji: { fontSize: 40, marginRight: 12 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantName: { fontSize: 16, fontWeight: "700" },
  plantType: { fontSize: 13, marginTop: 2 },
  indicators: { flexDirection: "row", marginTop: 8, gap: 12 },
  indicator: { flexDirection: "row", alignItems: "center", gap: 4 },
  indicatorText: { fontWeight: "600", fontSize: 13 },
  healthBar: { height: 6, borderRadius: 3, marginTop: 8, overflow: "hidden" },
  healthFill: { height: "100%" },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  alertText: { color: "#f97316", fontSize: 13 },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtnText: { color: "#fff", marginLeft: 8, fontWeight: "700" },
});

export default HomeScreen;
