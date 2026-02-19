import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Meal } from "../../../data/food";
import { getMeals } from "../../../data/meals";
import { MealComponent } from "../../../components/MealComponents";

export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadMeals = async () => {
        const savedMeals = await getMeals();
        if (isMounted) {
          setMeals(savedMeals);
        }
      };

      loadMeals();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des repas enregistrés</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meals.length === 0 ? (
          <Text style={styles.emptyText}>Aucun repas enregistré pour le moment.</Text>
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

            return (
              <MealComponent
                key={meal.id}
                mealType={meal.name}
                date={formattedDate}
                time={formattedTime}
                onPressDetail={() => {
                  router.push(`/(main)/(home)/${meal.id}`);
                }}
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
  },
});
