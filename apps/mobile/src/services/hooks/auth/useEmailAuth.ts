import { supabase } from '@app/integrations/supabase'
import { useAuthStore } from '@app/store/authStore'
import { useState } from 'react'

export function useEmailAuth() {
  const [error, setError] = useState<string | null>(null)
  const { setAuthData, setLoading } = useAuthStore()

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user && data.session?.access_token) {
        setAuthData({ user: data.user, token: data.session?.access_token })
      }
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
      console.error(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      // Sign up the user
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user && data.session?.access_token) {
        setAuthData({ user: data.user, token: data.session?.access_token })
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading: useAuthStore((state) => state.isLoading),
    error,
    login,
    signup,
  }
}
