import { supabase } from '@app/integrations/supabase'
import { useAuthStore } from '@app/store/authStore'
import { Session } from '@supabase/supabase-js'
import { useEffect, useRef } from 'react'

/**
 * This hook is used to handle the authentication session of the app.
 * It will update the auth store with the session data and handle the session changes.
 */
export function useSupabaseSession() {
  const { setAuthData, reset } = useAuthStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null)

  // Handle session changes
  const handleSessionChange = (session: Session | null) => {
    if (session) {
      setAuthData({ user: session.user, token: session.access_token })
    } else {
      reset()
    }
  }

  // Set up auth subscription
  useEffect(() => {
    if (isAuthenticated && !subscriptionRef.current) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        handleSessionChange(session)
      })
      subscriptionRef.current = subscription
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
        subscriptionRef.current = null
      }
    }
  }, [isAuthenticated])

  // Initial session setup
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSessionChange(session)
      }
    })
  }, [])
}
