import { StyleSheet, Text, View } from 'react-native'
import { useUser } from '@clerk/clerk-expo'

export default function Page() {
  const { user } = useUser()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des repas enregistrés</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
})