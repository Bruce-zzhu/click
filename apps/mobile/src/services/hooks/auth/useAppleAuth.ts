import { supabase } from '@app/integrations/supabase'
import { useAuthStore } from '@app/store/authStore'
import * as AppleAuthentication from 'expo-apple-authentication'

export const useAppleAuth = () => {
  const { setAuthData } = useAuthStore()

  const signIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      if (credential.identityToken) {
        const { error, data } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        })
        if (data.user && data.session?.access_token) {
          setAuthData({ user: data.user, token: data.session.access_token })
          return data
        }
        if (error) {
          throw new Error(error.message)
        }
      } else {
        throw new Error('No identityToken.')
      }
    } catch (e) {
      console.error(e)
      if (e.code === 'ERR_REQUEST_CANCELED') {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  return { signIn }
}
