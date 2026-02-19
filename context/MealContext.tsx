import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Food } from "../data/food";
import {
  Meal,
  deleteMeal as deleteMealFromStorage,
  getMeals,
  saveMeal,
} from "../data/meals";

interface MealContextType {
  meals: Meal[];
  currentMealFoods: Food[];
  addMeal: (meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addFoodToCurrentMeal: (food: Food) => void;
  removeFoodFromCurrentMeal: (foodId: string) => void;
  clearCurrentMealFoods: () => void;
  refreshMeals: () => Promise<void>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

export function MealProvider({ children }: { children: React.ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [currentMealFoods, setCurrentMealFoods] = useState<Food[]>([]);

  const refreshMeals = async () => {
    const storedMeals = await getMeals();
    setMeals(storedMeals);
  };

  useEffect(() => {
    refreshMeals();
  }, []);

  const addMeal = async (meal: Meal) => {
    await saveMeal(meal);
    await refreshMeals();
    setCurrentMealFoods([]);
  };

  const deleteMeal = async (id: string) => {
    await deleteMealFromStorage(id);
    await refreshMeals();
  };

  const addFoodToCurrentMeal = (food: Food) => {
    setCurrentMealFoods((prevFoods) => {
      if (prevFoods.some((item) => item.id === food.id)) return prevFoods;
      return [...prevFoods, food];
    });
  };

  const removeFoodFromCurrentMeal = (foodId: string) => {
    setCurrentMealFoods((prevFoods) =>
      prevFoods.filter((item) => item.id !== foodId)
    );
  };

  const clearCurrentMealFoods = () => {
    setCurrentMealFoods([]);
  };

  const value = useMemo(
    () => ({
      meals,
      currentMealFoods,
      addMeal,
      deleteMeal,
      addFoodToCurrentMeal,
      removeFoodFromCurrentMeal,
      clearCurrentMealFoods,
      refreshMeals,
    }),
    [meals, currentMealFoods]
  );

  return <MealContext.Provider value={value}>{children}</MealContext.Provider>;
}

export function useMealContext() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error("useMealContext must be used inside MealProvider");
  }

  return context;
}
