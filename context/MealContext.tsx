import { Meal, Food } from '../data/food'

interface MealContextType {
  meals: Meal[]
  addMeal: (meal: Meal) => void
  deleteMeal: (id: string) => void
  addFoodToCurrentMeal: (food: Food) => void
}
