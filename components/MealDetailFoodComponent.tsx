import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Food } from "../data/food";

interface MealDetailFoodComponentProps {
  food: Food;
}

export function MealDetailFoodComponent({ food }: MealDetailFoodComponentProps) {
  return (
    <View style={styles.foodCard}>
      {food.image_url ? (
        <Image source={{ uri: food.image_url }} style={styles.foodImage} />
      ) : (
        <View style={[styles.foodImage, styles.imagePlaceholder]} />
      )}

      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodBrand}>{food.brand}</Text>
        <Text style={styles.foodMeta}>Calories: {food.calories} kcal / 100g</Text>
        <Text style={styles.foodMeta}>Proteines: {food.proteins} g / 100g</Text>
        <Text style={styles.foodMeta}>Glucides: {food.carbs} g / 100g</Text>
        <Text style={styles.foodMeta}>Lipides: {food.fats} g / 100g</Text>
        <Text style={styles.foodMeta}>
          Nutriscore: {food.nutriscore ? food.nutriscore.toUpperCase() : "N/A"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  foodCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  foodImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: "#dddddd",
  },
  foodInfo: {
    flex: 1,
    gap: 2,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f1f1f",
  },
  foodBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  foodMeta: {
    fontSize: 13,
    color: "#333",
  },
});
