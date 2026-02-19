import React, { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Meal, getMeals } from "../../../data/meals";
import { MealComponent } from "../../../components/MealComponents";
import { getDailyCalorieGoal, saveDailyCalorieGoal } from "../../../data/settings";

function isSameCalendarDay(dateA: Date, dateB: Date): boolean {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function Page() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [goalInput, setGoalInput] = useState("2000");

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const loadData = async () => {
        const [savedMeals, savedGoal] = await Promise.all([getMeals(), getDailyCalorieGoal()]);

        if (!isMounted) return;
        setMeals(savedMeals);
        setDailyGoal(savedGoal);
        setGoalInput(String(savedGoal));
      };

      loadData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const todayCalories = useMemo(() => {
    const now = new Date();

    return meals.reduce((total, meal) => {
      const mealDate = new Date(meal.date);
      if (Number.isNaN(mealDate.getTime()) || !isSameCalendarDay(mealDate, now)) {
        return total;
      }

      const mealCalories = meal.foods.reduce((sum, food) => sum + (food.calories ?? 0), 0);
      return total + mealCalories;
    }, 0);
  }, [meals]);

  const progress = dailyGoal > 0 ? todayCalories / dailyGoal : 0;
  const progressPercent = Math.max(0, Math.min(progress * 100, 100));
  const remainingCalories = Math.max(0, dailyGoal - todayCalories);
  const isGoalExceeded = todayCalories > dailyGoal;

  const handleSaveGoal = async () => {
    const parsed = Number(goalInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert("Objectif invalide", "Saisis un nombre de calories superieur a 0.");
      return;
    }

    const roundedGoal = Math.round(parsed);
    await saveDailyCalorieGoal(roundedGoal);
    setDailyGoal(roundedGoal);
    setGoalInput(String(roundedGoal));
  };

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

      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Objectif calorique journalier</Text>
        <View style={styles.goalInputRow}>
          <TextInput
            style={styles.goalInput}
            keyboardType="numeric"
            value={goalInput}
            onChangeText={setGoalInput}
            placeholder="2000"
          />
          <Text style={styles.goalUnit}>kcal</Text>
          <Pressable style={styles.goalSaveButton} onPress={handleSaveGoal}>
            <Text style={styles.goalSaveButtonText}>Enregistrer</Text>
          </Pressable>
        </View>

        <Text style={styles.goalStats}>
          Aujourd'hui: {todayCalories.toFixed(0)} / {dailyGoal.toFixed(0)} kcal
        </Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              styles.progressFillDefault,
              isGoalExceeded && styles.progressFillExceeded,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
        <Text style={styles.goalHint}>
          {todayCalories >= dailyGoal
            ? "Objectif atteint aujourd'hui."
            : `Il reste ${remainingCalories.toFixed(0)} kcal pour atteindre l'objectif.`}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {meals.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="restaurant-outline" size={30} color="#97a19a" />
            <Text style={styles.emptyTitle}>Aucun repas enregistré</Text>
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
    gap: 14,
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
  goalCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e8e8e8",
    padding: 14,
    gap: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  goalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalInput: {
    minWidth: 90,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fafafa",
    color: "#222",
  },
  goalUnit: {
    color: "#666",
    fontWeight: "600",
  },
  goalSaveButton: {
    marginLeft: "auto",
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  goalSaveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  goalStats: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e5e5e5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressFillDefault: {
    backgroundColor: "#4CAF50",
  },
  progressFillExceeded: {
    backgroundColor: "#E0503D",
  },
  goalHint: {
    color: "#6a6a6a",
    fontSize: 12,
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
