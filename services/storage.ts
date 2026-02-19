import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getItem<T>(key: string, fallback: T): Promise<T> {
  try {
    const value = await AsyncStorage.getItem(key);
    if (!value) return fallback;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Storage read error for key "${key}":`, error);
    return fallback;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Storage write error for key "${key}":`, error);
  }
}
