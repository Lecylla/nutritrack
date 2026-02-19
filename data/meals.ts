import * as SecureStore from "expo-secure-store";
import { Meal } from "./food";

const MEALS_STORAGE_KEY = "nutritrack.meals";

export async function getMeals(): Promise<Meal[]> {
  try {
    const rawMeals = await SecureStore.getItemAsync(MEALS_STORAGE_KEY);
    if (!rawMeals) return [];

    const parsedMeals = JSON.parse(rawMeals) as Meal[];
    return Array.isArray(parsedMeals) ? parsedMeals : [];
  } catch (error) {
    console.error("Error reading meals:", error);
    return [];
  }
}

export async function saveMeal(meal: Meal): Promise<void> {
  try {
    const meals = await getMeals();
    const updatedMeals = [meal, ...meals];

    await SecureStore.setItemAsync(
      MEALS_STORAGE_KEY,
      JSON.stringify(updatedMeals)
    );
  } catch (error) {
    console.error("Error saving meal:", error);
  }
}
