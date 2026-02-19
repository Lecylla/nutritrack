import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth, useUser } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Ionicons name="person-circle-outline" size={100} color="#4CAF50" />
        <Text style={styles.infoValue}>
          {user?.emailAddresses?.[0]?.emailAddress || "Guest"}
        </Text>
      </View>
      <View style={styles.deconnection}>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={20} color="#ff0000" />
          <Text style={styles.buttonText}> Se deconnecter</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  profileInfo: {
    marginVertical: 8,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoValue: {
    color: "#333333",
  },
  deconnection: {
    marginTop: 20,
  },
  button: {
    borderColor: "#ff4d4d",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
  },
  buttonText: {
    color: "#ff0000",
    fontWeight: "bold",
  },
});
