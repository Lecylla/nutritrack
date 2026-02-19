import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Food, searchFood, searchFoodByText } from "../../../data/food";
import { Meal, saveMeal } from "../../../data/meals";
import { SearchFoodComponent } from "../../../components/SearchFoodComponent";
import { useMealContext } from "../../../context/MealContext";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export default function AddPage() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const {
    currentMealFoods,
    addFoodToCurrentMeal,
    removeFoodFromCurrentMeal,
    clearCurrentMealFoods,
  } = useMealContext();

  const mealTypeLabelMap: Record<MealType, string> = {
    breakfast: "Petit-dejeuner",
    lunch: "Dejeuner",
    dinner: "Diner",
    snack: "Snack",
  };

  const displayedFoods = useMemo(() => {
    const merged = [...currentMealFoods, ...results];
    const uniqueById = new Map<string, Food>();
    merged.forEach((food) => uniqueById.set(food.id, food));
    return Array.from(uniqueById.values());
  }, [currentMealFoods, results]);

  const canSaveMeal = Boolean(selectedMeal) && currentMealFoods.length > 0;
  const showNoSearchResult = query.trim().length >= 3 && !isSearching && results.length === 0;

  const handleToggleFood = (food: Food) => {
    const isAlreadyAdded = currentMealFoods.some((item) => item.id === food.id);

    if (isAlreadyAdded) {
      removeFoodFromCurrentMeal(food.id);
      return;
    }

    addFoodToCurrentMeal(food);
  };

  const handleSaveMeal = async () => {
    if (!selectedMeal || currentMealFoods.length === 0) return;

    const now = new Date();
    const meal: Meal = {
      id: now.getTime().toString(),
      name: mealTypeLabelMap[selectedMeal],
      date: now.toISOString(),
      foods: currentMealFoods,
    };

    await saveMeal(meal);

    clearCurrentMealFoods();
    setSelectedMeal(null);
    setQuery("");
    setResults([]);
    router.navigate("/(main)/(home)");
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      const trimmedQuery = query.trim();
      if (trimmedQuery.length < 3) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const foods = await searchFoodByText(trimmedQuery);
      setResults(foods);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const { barcode, scanTs } = useLocalSearchParams<{
    barcode?: string | string[];
    scanTs?: string;
  }>();

  useEffect(() => {
    const normalizedBarcode = Array.isArray(barcode) ? barcode[0] : barcode;
    const trimmedBarcode = normalizedBarcode?.trim();

    if (!trimmedBarcode) return;

    (async () => {
      const food = await searchFood(trimmedBarcode);
      if (food) {
        setResults((prev) => {
          const withoutDuplicate = prev.filter((item) => item.id !== food.id);
          return [food, ...withoutDuplicate];
        });
      }
    })();
  }, [barcode, scanTs]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nouveau repas</Text>
      <Text style={styles.subtitle}>
        Selection: {currentMealFoods.length} aliment
        {currentMealFoods.length > 1 ? "s" : ""}
      </Text>

      <Text style={styles.sectionTitle}>Type de repas</Text>
      <View style={styles.elementContainer}>
        {(["breakfast", "lunch", "dinner", "snack"] as MealType[]).map((mealType) => {
          const isSelected = selectedMeal === mealType;
          return (
            <Pressable
              key={mealType}
              style={[styles.element, isSelected && styles.selectedElement]}
              onPress={() => setSelectedMeal(mealType)}
            >
              <Text style={[styles.elementText, isSelected && styles.selectedElementText]}>
                {mealTypeLabelMap[mealType]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Ajouter un aliment</Text>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={18} color="#777" />
          <TextInput
            style={styles.searchBar}
            placeholder="Chercher un aliment (min. 3 lettres)"
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.navigate("/camera")}>
          <Ionicons name="barcode-outline" style={styles.barcodeIcon} />
        </Pressable>
      </View>

      <View style={styles.resultsContainer}>
        {isSearching && (
          <View style={styles.centeredState}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.helperText}>Recherche en cours...</Text>
          </View>
        )}

        {!isSearching && query.trim().length < 3 && (
          <Text style={styles.helperText}>
            Astuce: utilise la recherche ou le scanner pour ajouter des aliments.
          </Text>
        )}

        {showNoSearchResult && (
          <Text style={styles.helperText}>Aucun resultat pour cette recherche.</Text>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          {displayedFoods.map((item) => (
            <SearchFoodComponent
              key={item.id}
              food={item}
              onAdd={handleToggleFood}
              isAdded={currentMealFoods.some((food) => food.id === item.id)}
            />
          ))}
        </ScrollView>
      </View>

      <Pressable
        style={[styles.validateButton, !canSaveMeal && styles.disabledButton]}
        onPress={handleSaveMeal}
        disabled={!canSaveMeal}
      >
        <Text style={styles.validateButtonText}>
          Enregistrer le repas ({currentMealFoods.length})
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    color: "#666",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#222",
  },
  elementContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  element: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  selectedElement: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  elementText: {
    color: "#222",
    fontWeight: "600",
  },
  selectedElementText: {
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    borderRadius: 24,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    height: 46,
  },
  searchBar: {
    flex: 1,
    color: "#1f1f1f",
  },
  barcodeIcon: {
    backgroundColor: "#4CAF50",
    borderRadius: 24,
    padding: 11,
    color: "#ffffff",
    fontSize: 24,
  },
  resultsContainer: {
    flex: 1,
  },
  centeredState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 8,
  },
  helperText: {
    color: "#6d6d6d",
    fontSize: 13,
    marginBottom: 8,
  },
  validateButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: "#b7d8b8",
  },
  validateButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
