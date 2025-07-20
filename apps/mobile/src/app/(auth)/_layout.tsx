import { useAuthStore } from '@app/store/authStore'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (isAuthenticated) {
    return <Redirect href="/(protected)/(tabs)" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
    </Stack>
  )
}
