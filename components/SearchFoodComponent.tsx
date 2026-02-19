import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Food } from "../data/food";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  food: Food;
  onAdd: (food: Food) => void;
  isAdded: boolean;
}

export function SearchFoodComponent({ food, onAdd, isAdded }: Props) {
  return (
    <View style={styles.container}>
      {food.image_url ? (
        <Image
          source={{ uri: food.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]} />
      )}

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={styles.brand} numberOfLines={1}>
              {food.brand}
            </Text>
          </View>
          <Pressable
            style={[styles.addButton, isAdded && styles.addedButton]}
            onPress={() => onAdd(food)}
            hitSlop={10}
          >
            <Text>
              <Ionicons
                name={isAdded ? "checkmark" : "add"}
                style={styles.addIcon}
              />
            </Text>
          </Pressable>
        </View>

        <View style={styles.nutritionRow}>
          <Text style={styles.calories}>
            {food.calories} kcal / 100g
          </Text>
          <Text style={styles.nutriscore}>
            NutriScore: {food.nutriscore?.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholder: {
    backgroundColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  brand: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  calories: {
    fontSize: 13,
  },
  nutriscore: {
    fontSize: 13,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    alignItems: "center",
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  addedButton: {
    backgroundColor: "#2e7d32",
  },
  addIcon: {
    color: "#fff",
    fontSize: 20,
  },
});
