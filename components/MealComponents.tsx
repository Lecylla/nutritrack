import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MealComponentProps {
  mealType: string;
  date: string;
  time: string;
  totalCalories: number;
  onPressDetail: () => void;
}

export function MealComponent({
  mealType,
  date,
  time,
  totalCalories,
  onPressDetail,
}: MealComponentProps) {
  return (
    <Pressable style={styles.container} onPress={onPressDetail}>
      <View style={styles.topRow}>
        <View style={styles.infoContainer}>
          <Text style={styles.mealType}>{mealType}</Text>
          <Text style={styles.metaText}>
            {date} - {time}
          </Text>
          <Text style={styles.caloriesText}>{totalCalories.toFixed(0)} kcal</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9e9e9e" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    padding: 14,
    marginBottom: 12,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoContainer: {
    gap: 3,
    flex: 1,
    marginRight: 8,
  },
  mealType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3d8f43",
  },
  detailButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
