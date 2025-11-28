import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface NavigationBarProps {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  darkMode: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  currentScreen,
  setCurrentScreen,
  darkMode,
}) => {
  const navBg = darkMode ? "#0b1220" : "#fff";
  const activeColor = "#10b981";
  const inactiveColor = "#9ca3af";

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: navBg,
          borderTopColor: darkMode ? "#1f2937" : "#e5e7eb",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen("home")}
      >
        <Feather
          name="home"
          size={20}
          color={currentScreen === "home" ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.navText,
            { color: currentScreen === "home" ? activeColor : inactiveColor },
          ]}
        >
          Accueil
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen("analytics")}
      >
        <Feather
          name="bar-chart-2"
          size={20}
          color={currentScreen === "analytics" ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.navText,
            {
              color:
                currentScreen === "analytics" ? activeColor : inactiveColor,
            },
          ]}
        >
          Stats
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setCurrentScreen("settings")}
      >
        <Feather
          name="settings"
          size={20}
          color={currentScreen === "settings" ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.navText,
            {
              color: currentScreen === "settings" ? activeColor : inactiveColor,
            },
          ]}
        >
          Réglages
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "600",
  },
});

export default NavigationBar;
