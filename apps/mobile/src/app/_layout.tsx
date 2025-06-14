import { GlobalToast } from '@app/components/ui/GlobalToast'
import { queryClient } from '@app/integrations/tanstack-query'
import { AuthProvider } from '@app/providers/AuthProvider'
import { ThemeProvider } from '@app/providers/ThemeProvider'
import { ToastProvider } from '@tamagui/toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-gesture-handler'
import 'react-native-reanimated'

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(auth)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      // TODO: should we hide it when auth provider is ready
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider swipeDirection="horizontal" duration={6000}>
          <GlobalToast />
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootLayoutNav() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}
