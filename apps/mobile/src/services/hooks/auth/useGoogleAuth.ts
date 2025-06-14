import { supabase } from '@app/integrations/supabase'
import { useAuthStore } from '@app/store/authStore'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
})

export const useGoogleAuth = () => {
  const { setAuthData } = useAuthStore()

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log('userInfo', userInfo)
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        })
        if (data.user && data.session?.access_token) {
          setAuthData({ user: data.user, token: data.session.access_token })
          return data
        }
        if (error) {
          throw new Error(error.message)
        }
      } else {
        throw new Error('No idToken.')
      }
    } catch (error: any) {
      console.log(error)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return { signIn }
}
