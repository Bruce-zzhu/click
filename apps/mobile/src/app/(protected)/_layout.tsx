import { analytics } from '@app/integrations/mixpanel/analytics'
import { useSupabaseSession } from '@app/services/hooks/auth/useSupabaseSession'
import { useAuthStore } from '@app/store/authStore'
import { Redirect, Stack } from 'expo-router'
import { useEffect } from 'react'
import { useTheme } from 'tamagui'

export default function ProtectedLayout() {
  useSupabaseSession()


  const theme = useTheme()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    if (user) {
      analytics.registerSuperProperties(user)
      analytics.trackAppOpen(user.id)
    }
  }, [user])

  if (!isAuthenticated) return <Redirect href="/(auth)" />

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          title: 'Tamagui + Expo',
          presentation: 'modal',
          animation: 'slide_from_left',
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />
    </Stack>
  )
}
