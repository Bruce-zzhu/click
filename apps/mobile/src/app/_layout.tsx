import { GlobalToast } from '@app/components/ui/GlobalToast'
import { queryClient } from '@app/integrations/tanstack-query'
import { ThemeProvider } from '@app/providers/ThemeProvider'
import { useAuthStore } from '@app/store/authStore'
import { ToastProvider } from '@tamagui/toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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

  const _hydrated = useAuthStore((state) => state._hydrated)


  useEffect(() => {
    if (interLoaded && _hydrated) {
      SplashScreen.hideAsync()
    }
  }, [interLoaded, _hydrated])

  if (!(interLoaded && _hydrated)) {
    return null
  }


  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ThemeProvider>
            <ToastProvider swipeDirection="horizontal" duration={6000}>
              <GlobalToast />
              <RootLayoutNav />
            </ToastProvider>
          </ThemeProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaProvider>
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
