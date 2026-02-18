import { StyleSheet, Text, View } from 'react-native'
import { Link } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'

export default function Page() {
  const { user } = useUser()

  return (
    <View style={styles.container}>
      <Text>Welcome {user?.emailAddresses?.[0]?.emailAddress || 'Guest'} !</Text>
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
})