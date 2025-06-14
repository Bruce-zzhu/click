import { analytics } from '@app/integrations/mixpanel/analytics'
import { useEmailAuth } from '@app/services/hooks/auth/useEmailAuth'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Platform } from 'react-native'
import { Button, H1, Input, Paragraph, Spinner, YStack } from 'tamagui'
import { AppleSignInButton } from './AppleSignInButton'
import { GoogleSignInButton } from './GoogleSignInButton'

export function SignInView() {
  const router = useRouter()
  const { login, isLoading, error } = useEmailAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const data = await login(email, password)
      analytics.trackLogin(data.user, 'Email')
      router.replace('/(protected)/(tabs)')
    } catch (err) {
      console.error(err)
    }
  }
  return (
    <YStack flex={1} p="$4" gap="$4">
      <YStack flex={1} justify="center" gap="$4">
        <H1>Welcome Back</H1>
        <Paragraph>Sign in to continue</Paragraph>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Paragraph color="$red10">{error}</Paragraph> : null}

        <Button
          onPress={handleLogin}
          disabled={isLoading}
          icon={isLoading ? Spinner : undefined}
          themeInverse
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* // * For development, Google sign-in only works on native build */}
        {/* // * For development, apple sign-in only works on Expo Go */}
        <GoogleSignInButton />
        {Platform.OS === 'ios' && <AppleSignInButton />}

        <Button onPress={() => router.push('/(auth)/signup')} variant="outlined">
          Don't have an account? Sign Up
        </Button>
      </YStack>
    </YStack>
  )
}
