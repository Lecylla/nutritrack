import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable, Alert } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Meal } from "../../../data/meals";
import { getMeals, deleteMeal } from "../../../data/meals";
import { Food } from "../../../data/food";
import { MealDetailFoodComponent } from "../../../components/MealDetailFoodComponent";

interface MealDetailProps {
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

export default function MealDetailPage({ food }: MealDetailProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadMeal = async () => {
        const meals = await getMeals();
        const foundMeal = meals.find((item) => item.id === id) ?? null;

        if (isMounted) {
          setMeal(foundMeal);
        }
      };

      loadMeal();

      return () => {
        isMounted = false;
      };
    }, [id])
  );

  if (!meal) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detail du repas</Text>
        <Text style={styles.emptyText}>Repas introuvable.</Text>
      </View>
    );
  }

  const parsedDate = new Date(meal.date);
  const hasValidDate = !Number.isNaN(parsedDate.getTime());

  const formattedDate = hasValidDate
    ? parsedDate.toLocaleDateString("fr-FR")
    : meal.date;
  const formattedTime = hasValidDate
    ? parsedDate.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "--:--";

  const totalCalories = meal.foods.reduce(
    (sum, food) => sum + (food.calories ?? 0),
    0
  );
  const totalProteins = meal.foods.reduce(
    (sum, food) => sum + (food.proteins ?? 0),
    0
  );
  const totalCarbs = meal.foods.reduce((sum, food) => sum + (food.carbs ?? 0), 0);
  const totalFats = meal.foods.reduce((sum, food) => sum + (food.fats ?? 0), 0);

  const handleDeleteMeal = () => {
    if (!id) return;

    Alert.alert(
      "Supprimer le repas",
      "Voulez-vous vraiment supprimer ce repas ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteMeal(id);
            router.replace("/(main)/(home)");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail du repas</Text>

      <Pressable style={styles.deleteButton} onPress={handleDeleteMeal}>
        <Text style={styles.deleteButtonText}>Supprimer le repas</Text>
      </Pressable>

      <View style={styles.summaryCard}>
        <Text style={styles.mealName}>{meal.name} ({meal.foods.length} aliments)</Text>
        <Text style={styles.metaText}>{formattedDate} {formattedTime}</Text>

        <View style={styles.macrosRow}>
          <MacroPill value={`${totalCalories.toFixed(0)} kcal`} label="Calories" color="#66B36B" />
          <MacroPill value={`${totalProteins.toFixed(1)}g`} label="Proteines" color="#61A6F0" />
          <MacroPill value={`${totalCarbs.toFixed(1)}g`} label="Glucides" color="#E6AA43" />
          <MacroPill value={`${totalFats.toFixed(1)}g`} label="Lipides" color="#DF7568" />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Aliments</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {meal.foods.map((food) => (
          <MealDetailFoodComponent key={food.id} food={food} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 14,
    marginBottom: 16,
    gap: 4,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1f1f",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#E53935",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginLeft: 180,
    marginTop: -50,
    marginBottom: 15,
  },
  deleteButtonText: {
    color: "#ffffff",
    fontSize: 14,
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
