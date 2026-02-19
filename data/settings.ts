import { getItem, setItem } from "../services/storage";

const DAILY_CALORIE_GOAL_KEY = "nutritrack.dailyCalorieGoal";
const DEFAULT_DAILY_GOAL = 2000;

export async function getDailyCalorieGoal(): Promise<number> {
  const goal = await getItem<number>(DAILY_CALORIE_GOAL_KEY, DEFAULT_DAILY_GOAL);
  return typeof goal === "number" && goal > 0 ? goal : DEFAULT_DAILY_GOAL;
}

export async function saveDailyCalorieGoal(goal: number): Promise<void> {
  const normalizedGoal = Number.isFinite(goal) && goal > 0 ? goal : DEFAULT_DAILY_GOAL;
  await setItem(DAILY_CALORIE_GOAL_KEY, Math.round(normalizedGoal));
}
