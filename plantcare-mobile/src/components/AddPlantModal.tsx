import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";

const AddPlantModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onAddPlant: (plant: {
    name: string;
    type: string;
    room: string;
    wateringFrequency: number;
  }) => void;
}> = ({ visible, onClose, onAddPlant }) => {
  const [plantData, setPlantData] = useState({
    name: "",
    type: "Tropicale",
    room: "",
    wateringFrequency: 7,
  });

  const handleAddPlant = () => {
    if (plantData.name && plantData.room) {
      onAddPlant(plantData);
      setPlantData({
        name: "",
        type: "Tropicale",
        room: "",
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
            Ajouter une Plante
          </Text>

          <TextInput
            placeholder="Nom"
            value={plantData.name}
            onChangeText={(text) => setPlantData({ ...plantData, name: text })}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Emplacement"
            value={plantData.room}
            onChangeText={(text) => setPlantData({ ...plantData, room: text })}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
            }}
          />

          <Text style={{ marginBottom: 10 }}>
            Fréquence d'arrosage: {plantData.wateringFrequency} jours
          </Text>
          <Slider
            minimumValue={1}
            maximumValue={30}
            value={plantData.wateringFrequency}
            onValueChange={(value) =>
              setPlantData({ ...plantData, wateringFrequency: value })
            }
            style={{ marginBottom: 20 }}
          />

          <TouchableOpacity
            onPress={handleAddPlant}
            style={{ backgroundColor: "#28a745", padding: 15, borderRadius: 5 }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Ajouter la plante
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: "#007bff", textAlign: "center" }}>
              Annuler
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AddPlantModal;
