import { useAuthStore } from '@app/store/authStore'
import { useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

/**
 * This component is used to redirect the user to the appropriate screen based on their authentication state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const segments = useSegments()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const _hydrated = useAuthStore((state) => state._hydrated)

  useEffect(() => {
    if (!_hydrated) return // Wait for the store to hydrate

    const inAuthGroup = segments[0] === '(auth)'

    if (isAuthenticated && inAuthGroup) {
      // Redirect away from auth group if authenticated
      router.replace('/(protected)/(tabs)')
    } else if (!isAuthenticated && !inAuthGroup) {
      // Redirect to auth group if not authenticated
      router.replace('/(auth)')
    }
  }, [isAuthenticated, segments, _hydrated])

  // While the store is not hydrated, show nothing
  if (!_hydrated) return null

  return children
}
