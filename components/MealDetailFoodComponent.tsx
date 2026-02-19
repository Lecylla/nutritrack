import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Food } from "../data/food";

interface MealDetailFoodComponentProps {
  food: Food;
}

function MacroPill({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  return (
    <View style={[styles.macroPill, { borderColor: color }]}>
      <Text style={[styles.macroValue, { color }]}>{value}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  );
}

export function MealDetailFoodComponent({ food }: MealDetailFoodComponentProps) {
  const nutriscoreValue = (food.nutriscore || "n/a").toUpperCase();
  const nutriscoreColorMap: Record<string, string> = {
    A: "#39A845",
    B: "#73B842",
    C: "#F3B43F",
    D: "#F08C34",
    E: "#D95A3C",
    "N/A": "#9E9E9E",
  };

  const nutriscoreColor = nutriscoreColorMap[nutriscoreValue] ?? "#9E9E9E";

  return (
    <View style={styles.foodCard}>
      <View style={styles.headerRow}>
        {food.image_url ? (
          <Image source={{ uri: food.image_url }} style={styles.foodImage} />
        ) : (
          <View style={[styles.foodImage, styles.imagePlaceholder]} />
        )}

        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={1}>
            {food.name}
          </Text>
          <Text style={styles.foodBrand} numberOfLines={1}>
            {food.brand}
          </Text>
        </View>

        <View style={[styles.nutriscoreBadge, { backgroundColor: nutriscoreColor }]}>
          <Text style={styles.nutriscoreText}>{nutriscoreValue}</Text>
        </View>
      </View>

      <View style={styles.macrosRow}>
        <MacroPill value={`${food.calories} kcal`} label="Calories" color="#66B36B" />
        <MacroPill value={`${food.proteins}g`} label="Proteines" color="#61A6F0" />
        <MacroPill value={`${food.carbs}g`} label="Glucides" color="#E6AA43" />
        <MacroPill value={`${food.fats}g`} label="Lipides" color="#DF7568" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ececec",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodImage: {
    width: 62,
    height: 62,
    borderRadius: 10,
    backgroundColor: "#f1f1f1",
  },
  imagePlaceholder: {
    borderWidth: 1,
    borderColor: "#e4e4e4",
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },
  foodName: {
    fontSize: 32 / 2,
    fontWeight: "700",
    color: "#212121",
  },
  foodBrand: {
    fontSize: 30 / 2,
    color: "#8a8a8a",
    marginTop: 2,
  },
  nutriscoreBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  nutriscoreText: {
    color: "#ffffff",
    fontSize: 22 / 2,
    fontWeight: "800",
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  macroPill: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  macroValue: {
    fontSize: 30 / 2,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 24 / 2,
    color: "#8f8f8f",
    marginTop: 2,
    fontWeight: "600",
  },
});
