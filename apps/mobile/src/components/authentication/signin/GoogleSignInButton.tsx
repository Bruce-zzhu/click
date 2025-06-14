import { analytics } from '@app/integrations/mixpanel/analytics'
import { useGoogleAuth } from '@app/services/hooks/auth/useGoogleAuth'
import { GoogleSigninButton as _GoogleSigninButton } from '@react-native-google-signin/google-signin'
import { getAuthActionFromUser } from '../utils'

export function GoogleSignInButton() {
  const { signIn } = useGoogleAuth()

  const onPress = async () => {
    const data = await signIn()
    if (!data) return
    // Event tracking
    const authAction = getAuthActionFromUser({
      created_at: data?.user.created_at,
      last_sign_in_at: data?.user.last_sign_in_at,
    })
    if (authAction === 'signup') {
      analytics.trackSignup(data.user)
    } else {
      analytics.trackLogin(data.user, 'Google')
    }
  }

  return (
    <_GoogleSigninButton
      size={_GoogleSigninButton.Size.Wide}
      color={_GoogleSigninButton.Color.Dark}
      onPress={onPress}
    />
  )
}
