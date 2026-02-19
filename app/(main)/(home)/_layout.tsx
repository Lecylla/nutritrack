import { Stack } from "expo-router";

export default function HomeRoutesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Repas",
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          title: "Detail du repas",
          headerBackTitle: "Mes repas",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
