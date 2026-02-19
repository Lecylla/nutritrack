import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function MainRoutesLayout() {
  const { isSignedIn } = useAuth()

  if (!isSignedIn) {
    return <Redirect href={'/sign-in'} />
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Repas",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? "#4CAF50" : "#9E9E9E"}
            />
          ),
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#9E9E9E',
        }}
      />
      <Tabs.Screen
        name="(add)"
        options={{
          title: "Nouveau Repas",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              size={24}
              color={focused ? "#4CAF50" : "#9E9E9E"}
            />
          ),
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#9E9E9E',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? "#4CAF50" : "#9E9E9E"}
            />
          ),
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: '#9E9E9E',
        }}
      />
    </Tabs>
  )
}
