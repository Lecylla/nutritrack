import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddPage() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Type de repas</Text>
                <View style={styles.elementContainer}>
                    <Pressable style={styles.element}>
                        <Text>Petit-déjeuner</Text>
                    </Pressable>
                    <Pressable style={styles.element}>
                        <Text>Déjeuner</Text>
                    </Pressable>
                    <Pressable style={styles.element}>
                        <Text>Dîner</Text>
                    </Pressable>
                    <Pressable style={styles.element}>
                        <Text>Snack</Text>
                    </Pressable>
                </View>
            </View>
            <Text style={styles.title}>Ajouter un aliment</Text>
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchBar} placeholder="Search for food items..." />
                <Pressable onPress={() => {
                    router.navigate('/camera')
                }}>
                    <Ionicons name="barcode-outline" style={styles.barcodeIcon} />
                </Pressable>
            </View>
            <Pressable style={styles.validateButton}>
                <Text style={styles.validateButtonText}>Ajouter le repas</Text>
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
        width: 250,
        height: 40,
        marginBottom: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'space-between',
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