import { Food } from "./food";
import { getItem, setItem } from "../services/storage";

export interface Meal {
  id: string;
  name: string;
  date: string;
  foods: Food[];
}

const MEALS_STORAGE_KEY = "nutritrack.meals";

export async function getMeals(): Promise<Meal[]> {
  const meals = await getItem<Meal[]>(MEALS_STORAGE_KEY, []);
  return Array.isArray(meals) ? meals : [];
}

export async function saveMeal(meal: Meal): Promise<void> {
  try {
    const meals = await getMeals();
    const updatedMeals = [meal, ...meals];
    await setItem(MEALS_STORAGE_KEY, updatedMeals);
  } catch (error) {
    console.error("Error saving meal:", error);
  }
}

export async function deleteMeal(mealId: string): Promise<void> {
  try {
    const meals = await getMeals();
    const updatedMeals = meals.filter((meal) => meal.id !== mealId);
    await setItem(MEALS_STORAGE_KEY, updatedMeals);
  } catch (error) {
    console.error("Error deleting meal:", error);
  }
}
