import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";

const SettingsScreen = ({
  darkMode,
  setDarkMode,
  settings,
  setSettings,
}: any) => {
  const textColor = darkMode ? "#fff" : "#1f2937";
  const cardBg = darkMode ? "#0b1220" : "#fff";
  const subtextColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
      <Text style={[styles.title, { color: textColor }]}>Paramètres</Text>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>
          Préférences
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            {darkMode ? (
              <Feather name="moon" size={20} color="#9ca3af" />
            ) : (
              <Feather name="sun" size={20} color="#f59e0b" />
            )}
            <Text style={[styles.settingText, { color: textColor }]}>
              Mode sombre
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#ccc", true: "#10b981" }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingLabel}>
            <Feather name="bell" size={20} color="#3b82f6" />
            <Text style={[styles.settingText, { color: textColor }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(v) =>
              setSettings({ ...settings, notifications: v })
            }
            trackColor={{ false: "#ccc", true: "#10b981" }}
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <Text style={[styles.cardTitle, { color: textColor }]}>À propos</Text>
        <Text style={[styles.aboutText, { color: subtextColor }]}>
          Version: 1.0.0
        </Text>
        <Text style={[styles.aboutText, { color: subtextColor }]}>
          PlantCare Pro © 2025
        </Text>
        <Text style={[styles.aboutText, { color: subtextColor }]}>
          Développé avec ❤️ pour vos plantes
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  card: { padding: 16, borderRadius: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLabel: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingText: { fontSize: 16, fontWeight: "500" },
  aboutText: { fontSize: 14, marginBottom: 6 },
});

export default SettingsScreen;
