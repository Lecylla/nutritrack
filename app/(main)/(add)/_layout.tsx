import { Stack } from "expo-router";

export default function AddRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Nouveau repas",
          headerTitleAlign: "center",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="camera"
        options={{
          headerShown: true,
          title: "Scanner un code-barres",
          headerBackTitle: "Ajouter",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
