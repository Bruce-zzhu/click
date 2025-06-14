import { supabase } from '@app/integrations/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@supabase/supabase-js'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const AUTH_STORAGE_KEY = 'auth-storage'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  _hydrated: boolean
  // Actions
  _setHydrated: (hydrated: boolean) => void
  setAuthData: ({ user, token }: { user: User; token: string }) => void
  setLoading: (isLoading: boolean) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  reset: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      _hydrated: false,
      _setHydrated: (hydrated) => set({ _hydrated: hydrated }),
      setLoading: (isLoading) => set({ isLoading }),
      setAuthData: ({ user, token }: { user: User; token: string }) => {
        set({
          user,
          token,
          isAuthenticated: true,
        })
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      reset: async () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY)
      },
      logout: async () => {
        try {
          // Optimistically update UI
          await get().reset()

          // Then perform the actual logout
          const { error } = await supabase.auth.signOut()
          if (error) {
            // If logout fails, we need to check the session state
            const {
              data: { session },
            } = await supabase.auth.getSession()
            if (session) {
              // Restore the session if logout failed
              set({
                user: session.user,
                token: session.access_token,
                isAuthenticated: true,
              })
              throw error
            }
          }
        } catch (error) {
          throw error
        }
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._setHydrated(true)
          if (state.user && state.token) {
            state.setAuthData({
              user: state.user,
              token: state.token,
            })
          }
        }
      },
    }
  )
)
