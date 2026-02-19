import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Food, searchFoodByText, searchFood } from '../../../data/food';
import { Meal, saveMeal } from '../../../data/meals';
import { SearchFoodComponent } from '../../../components/SearchFoodComponent';
import { useMealContext } from '../../../context/MealContext';

export default function AddPage() {
    const router = useRouter();
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
    const {
        currentMealFoods,
        addFoodToCurrentMeal,
        removeFoodFromCurrentMeal,
        clearCurrentMealFoods,
    } = useMealContext();

    const handleMealSelection = (mealType: string) => {
        setSelectedMeal(mealType);
        console.log("Selected meal type:", mealType);
    }

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Food[]>([]);
    const displayedFoods = useMemo(() => {
        const merged = [...currentMealFoods, ...results];
        const uniqueById = new Map<string, Food>();

        merged.forEach((food) => {
            uniqueById.set(food.id, food);
        });

        return Array.from(uniqueById.values());
    }, [currentMealFoods, results]);

    const mealTypeLabelMap: Record<string, string> = {
        breakfast: "Petit-dejeuner",
        lunch: "Dejeuner",
        dinner: "Diner",
        snack: "Snack",
    };

    const handleToggleFood = (food: Food) => {
        const isAlreadyAdded = currentMealFoods.some((item) => item.id === food.id);

        if (isAlreadyAdded) {
            removeFoodFromCurrentMeal(food.id);
            return;
        }

        addFoodToCurrentMeal(food);
    };

    const handleSaveMeal = async () => {
        if (!selectedMeal) {
            Alert.alert("Type de repas requis", "Selectionne un type de repas.");
            return;
        }

        if (currentMealFoods.length === 0) {
            Alert.alert("Aucun aliment", "Ajoute au moins un aliment au repas.");
            return;
        }

        const now = new Date();
        const meal: Meal = {
            id: now.getTime().toString(),
            name: mealTypeLabelMap[selectedMeal] ?? selectedMeal,
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
            if (query.length > 2) {
                const foods = await searchFoodByText(query);
                setResults(foods);
            } else if (query.length > 0) {
                setResults([]);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const { barcode, scanTs } = useLocalSearchParams<{ barcode?: string | string[]; scanTs?: string }>();

    useEffect(() => {
        const normalizedBarcode = Array.isArray(barcode) ? barcode[0] : barcode;
        const trimmedBarcode = normalizedBarcode?.trim();

        if (trimmedBarcode) {
            (async () => {
                const food = await searchFood(trimmedBarcode);
                if (food) {
                    setResults((prev) => {
                        const withoutDuplicate = prev.filter((item) => item.id !== food.id);
                        return [food, ...withoutDuplicate];
                    });
                } else {
                    Alert.alert("Produit introuvable", "Aucun aliment trouve pour ce code-barres.");
                }
            })();
        }
    }, [barcode, scanTs]);

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Type de repas</Text>
                <View style={styles.elementContainer}>
                    <Pressable
                        style={selectedMeal === "breakfast" ? [styles.element, styles.selectedElement] : styles.element}
                        onPress={() => handleMealSelection("breakfast")}
                    >
                        <Text>Petit-déjeuner</Text>
                    </Pressable>
                    <Pressable
                        style={selectedMeal === "lunch" ? [styles.element, styles.selectedElement] : styles.element}
                        onPress={() => handleMealSelection("lunch")}
                    >
                        <Text>Déjeuner</Text>
                    </Pressable>
                    <Pressable
                        style={selectedMeal === "dinner" ? [styles.element, styles.selectedElement] : styles.element}
                        onPress={() => handleMealSelection("dinner")}
                    >
                        <Text>Dîner</Text>
                    </Pressable>
                    <Pressable
                        style={selectedMeal === "snack" ? [styles.element, styles.selectedElement] : styles.element}
                        onPress={() => handleMealSelection("snack")}
                    >
                        <Text>Snack</Text>
                    </Pressable>
                </View>
            </View>
            <Text style={styles.title}>Ajouter un aliment</Text>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for food items..."
                    value={query}
                    onChangeText={setQuery}
                />
                <Text>  </Text>
                <Pressable onPress={() => {
                    router.navigate('/camera')
                }}>
                    <Ionicons name="barcode-outline" style={styles.barcodeIcon} />
                </Pressable>
            </View>
            <ScrollView>
                {displayedFoods.map((item) => (
                    <SearchFoodComponent
                        key={item.id}
                        food={item}
                        onAdd={handleToggleFood}
                        isAdded={currentMealFoods.some((food) => food.id === item.id)}
                    />
                ))}
            </ScrollView>
            <Pressable style={styles.validateButton} onPress={handleSaveMeal}>
                <Text style={styles.validateButtonText}>
                    Ajouter le repas ({currentMealFoods.length})
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
    },
    barcodeIcon: {
        marginBottom: 16,
        backgroundColor: "#4CAF50",
        borderRadius: 24,
        padding: 12,
        color: '#ffffff',
        fontSize: 24,
    },
    searchBar: {
        width: '82%',
        height: 40,
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    element: {
        fontSize: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        padding: 8,
        width: 'auto',
    },
    selectedElement: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        color: '#ffffff',
    },
    elementContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    validateButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 24,
        padding: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    validateButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
