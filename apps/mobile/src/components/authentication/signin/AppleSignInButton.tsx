import { analytics } from '@app/integrations/mixpanel/analytics'
import { useAppleAuth } from '@app/services/hooks/auth/useAppleAuth'
import * as AppleAuthentication from 'expo-apple-authentication'
import { getAuthActionFromUser } from '../utils'

export function AppleSignInButton() {
  const { signIn } = useAppleAuth()

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
      analytics.trackLogin(data.user, 'Apple')
    }
  }

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={{ width: 200, height: 64 }}
      onPress={onPress}
    />
  )
}
