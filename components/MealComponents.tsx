import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.mealType}>{mealType}</Text>
        <Text style={styles.metaText}>{date} {time}</Text>
        <Text style={styles.metaText}>Calories: {totalCalories.toFixed(0)} kcal</Text>
      </View>

      <Pressable style={styles.detailButton} onPress={onPressDetail}>
        <Ionicons name="eye-outline" size={18} color="#fff" />
        <Text style={styles.detailButtonText}>Voir le detail</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  infoContainer: {
    gap: 4,
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
  detailButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
