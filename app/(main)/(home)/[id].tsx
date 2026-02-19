import React, { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Meal, deleteMeal, getMeals } from "../../../data/meals";
import { MealDetailFoodComponent } from "../../../components/MealDetailFoodComponent";

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

export default function MealDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadMeal = async () => {
        const meals = await getMeals();
        const foundMeal = meals.find((item) => item.id === id) ?? null;
        if (isMounted) setMeal(foundMeal);
      };

      loadMeal();

      return () => {
        isMounted = false;
      };
    }, [id])
  );

  const handleDeleteMeal = () => {
    if (!id) return;

    Alert.alert("Supprimer le repas", "Voulez-vous vraiment supprimer ce repas ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteMeal(id);
          router.replace("/(main)/(home)");
        },
      },
    ]);
  };

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Repas introuvable.</Text>
      </View>
    );
  }

  const parsedDate = new Date(meal.date);
  const hasValidDate = !Number.isNaN(parsedDate.getTime());
  const formattedDate = hasValidDate ? parsedDate.toLocaleDateString("fr-FR") : meal.date;
  const formattedTime = hasValidDate
    ? parsedDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const totalCalories = meal.foods.reduce((sum, food) => sum + (food.calories ?? 0), 0);
  const totalProteins = meal.foods.reduce((sum, food) => sum + (food.proteins ?? 0), 0);
  const totalCarbs = meal.foods.reduce((sum, food) => sum + (food.carbs ?? 0), 0);
  const totalFats = meal.foods.reduce((sum, food) => sum + (food.fats ?? 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.mealHeader}>{meal.name}</Text>
      <Text style={styles.metaText}>
        {formattedDate} - {formattedTime}
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total nutritionnel</Text>
        <View style={styles.macrosRow}>
          <MacroPill value={`${totalCalories.toFixed(0)} kcal`} label="Calories" color="#66B36B" />
          <MacroPill value={`${totalProteins.toFixed(1)}g`} label="Proteines" color="#61A6F0" />
          <MacroPill value={`${totalCarbs.toFixed(1)}g`} label="Glucides" color="#E6AA43" />
          <MacroPill value={`${totalFats.toFixed(1)}g`} label="Lipides" color="#DF7568" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Aliments ({meal.foods.length})</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.foodsContainer}
      >
        {meal.foods.map((food) => (
          <MealDetailFoodComponent key={food.id} food={food} />
        ))}
      </ScrollView>

      <Pressable style={styles.deleteButton} onPress={handleDeleteMeal}>
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text style={styles.deleteButtonText}>Supprimer ce repas</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f6f7",
  },
  mealHeader: {
    fontSize: 19,
    fontWeight: "800",
    color: "#151515",
  },
  metaText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 14,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#202020",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1f1f1f",
  },
  foodsContainer: {
    paddingBottom: 92,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
    backgroundColor: "#E0503D",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 22 / 2,
    fontWeight: "700",
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
    fontSize: 15,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 12,
    color: "#8f8f8f",
    marginTop: 2,
    fontWeight: "600",
  },
});
