import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Feather } from "@expo/vector-icons";

interface AddPlantModalProps {
  visible: boolean;
  onClose: () => void;
  onAddPlant: (plant: {
    name: string;
    type: string;
    room: string;
    image: string; // ✅ FIXED: Ajout de image
    wateringFrequency: number;
  }) => void;
}

const plantEmojis = [
  "🌱",
  "🌿",
  "🪴",
  "🌵",
  "🌴",
  "🌺",
  "🌸",
  "🌼",
  "🌻",
  "🌹",
];

const plantTypes = [
  "Tropicale",
  "Succulente",
  "Cactus",
  "Fougère",
  "Orchidée",
  "Plante d'intérieur",
  "Plante grasse",
  "Autre",
];

const AddPlantModal: React.FC<AddPlantModalProps> = ({
  visible,
  onClose,
  onAddPlant,
}) => {
  const [plantData, setPlantData] = useState({
    name: "",
    type: "Tropicale",
    room: "",
    image: "🌱",
    wateringFrequency: 7,
  });

  const handleAddPlant = () => {
    if (plantData.name && plantData.room) {
      // ✅ Arrondir la fréquence d'arrosage avant d'envoyer
      onAddPlant({
        ...plantData,
        wateringFrequency: Math.round(plantData.wateringFrequency),
      });
      // Reset form
      setPlantData({
        name: "",
        type: "Tropicale",
        room: "",
        image: "🌱",
        wateringFrequency: 7,
      });
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter une Plante</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#1f2937" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Nom */}
            <Text style={styles.label}>Nom de la plante *</Text>
            <TextInput
              placeholder="Ex: Monstera"
              value={plantData.name}
              onChangeText={(text) =>
                setPlantData({ ...plantData, name: text })
              }
              style={styles.input}
            />

            {/* Type */}
            <Text style={styles.label}>Type de plante</Text>
            <View style={styles.typeContainer}>
              {plantTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setPlantData({ ...plantData, type })}
                  style={[
                    styles.typeButton,
                    plantData.type === type && styles.typeButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      plantData.type === type && styles.typeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Emoji */}
            <Text style={styles.label}>Icône</Text>
            <View style={styles.emojiContainer}>
              {plantEmojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  onPress={() => setPlantData({ ...plantData, image: emoji })}
                  style={[
                    styles.emojiButton,
                    plantData.image === emoji && styles.emojiButtonActive,
                  ]}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Emplacement */}
            <Text style={styles.label}>Emplacement *</Text>
            <TextInput
              placeholder="Ex: Salon, Chambre, Bureau"
              value={plantData.room}
              onChangeText={(text) =>
                setPlantData({ ...plantData, room: text })
              }
              style={styles.input}
            />

            {/* Fréquence d'arrosage */}
            <Text style={styles.label}>
              Fréquence d'arrosage: {Math.round(plantData.wateringFrequency)}{" "}
              jours
            </Text>
            <Slider
              minimumValue={1}
              maximumValue={30}
              step={1}
              value={plantData.wateringFrequency}
              onValueChange={(value) =>
                setPlantData({ ...plantData, wateringFrequency: value })
              }
              minimumTrackTintColor="#10b981"
              maximumTrackTintColor="#e5e7eb"
              thumbTintColor="#10b981"
              style={styles.slider}
            />

            {/* Buttons */}
            <TouchableOpacity
              onPress={handleAddPlant}
              style={[
                styles.addButton,
                (!plantData.name || !plantData.room) &&
                  styles.addButtonDisabled,
              ]}
              disabled={!plantData.name || !plantData.room}
            >
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Ajouter la plante</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1f2937",
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  typeButtonActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  typeText: {
    fontSize: 13,
    color: "#6b7280",
  },
  typeTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  emojiContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  emojiButtonActive: {
    borderColor: "#10b981",
    backgroundColor: "#d1fae5",
  },
  emoji: {
    fontSize: 24,
  },
  slider: {
    marginVertical: 8,
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  addButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
  },
});

export default AddPlantModal;
