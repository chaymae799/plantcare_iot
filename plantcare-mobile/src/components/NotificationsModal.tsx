import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
  notifications: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    plant?: string; // ✅ FIXED: plant est optionnel
  }>;
  darkMode: boolean;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({
  visible,
  onClose,
  notifications,
  darkMode,
}) => {
  const cardBg = darkMode ? "#0b1220" : "#fff";
  const textColor = darkMode ? "#fff" : "#1f2937";
  const subtextColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={[styles.modal, { backgroundColor: cardBg }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              Notifications
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Feather name="bell-off" size={48} color={subtextColor} />
                <Text style={[styles.emptyText, { color: subtextColor }]}>
                  Aucune notification
                </Text>
              </View>
            ) : (
              notifications.map((notif) => (
                <View
                  key={notif.id}
                  style={[
                    styles.notifCard,
                    notif.type === "danger" && styles.notifDanger,
                    notif.type === "warning" && styles.notifWarning,
                    notif.type === "success" && styles.notifSuccess,
                    notif.type === "ml" && styles.notifMl,
                  ]}
                >
                  <Text style={[styles.message, { color: textColor }]}>
                    {notif.message}
                  </Text>
                  <Text style={[styles.time, { color: subtextColor }]}>
                    {notif.time}
                  </Text>
                </View>
              ))
            )}
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  notifCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  notifDanger: {
    backgroundColor: "#fee2e2",
    borderLeftColor: "#ef4444",
  },
  notifWarning: {
    backgroundColor: "#fef3c7",
    borderLeftColor: "#f59e0b",
  },
  notifSuccess: {
    backgroundColor: "#dcfce7",
    borderLeftColor: "#10b981",
  },
  notifMl: {
    backgroundColor: "#dbeafe",
    borderLeftColor: "#3b82f6",
  },
  message: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
  },
});

export default NotificationsModal;
