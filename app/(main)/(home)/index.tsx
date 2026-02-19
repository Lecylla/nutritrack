import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Meal, getMeals } from "../../../data/meals";
import { MealComponent } from "../../../components/MealComponents";

export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadMeals = async () => {
        const savedMeals = await getMeals();
        if (isMounted) setMeals(savedMeals);
      };

      loadMeals();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Mes repas</Text>
          <Text style={styles.subtitle}>
            {meals.length} repas enregistré{meals.length > 1 ? "s" : ""}
          </Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => router.push("/(main)/(add)")}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="restaurant-outline" size={30} color="#97a19a" />
            <Text style={styles.emptyTitle}>Aucun repas enregistre</Text>
            <Text style={styles.emptyText}>
              Commence par ajouter ton premier repas depuis l'onglet Ajouter.
            </Text>
          </View>
        ) : (
          meals.map((meal) => {
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

            return (
              <MealComponent
                key={meal.id}
                mealType={meal.name}
                date={formattedDate}
                time={formattedTime}
                totalCalories={totalCalories}
                onPressDetail={() => router.push(`/(main)/(home)/${meal.id}`)}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: "#f5f6f7",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#121212",
  },
  subtitle: {
    fontSize: 13,
    color: "#707070",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 20,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: "#6d6d6d",
    textAlign: "center",
  },
});
