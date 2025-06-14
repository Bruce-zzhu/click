import { analytics } from '@app/integrations/mixpanel/analytics'
import { useEmailAuth } from '@app/services/hooks/auth/useEmailAuth'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Button, H1, Input, Paragraph, Spinner, YStack } from 'tamagui'

export default function SignupScreen() {
  const router = useRouter()
  const { signup, isLoading, error } = useEmailAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleSignup = async () => {
    try {
      if (!validatePasswords()) return

      const data = await signup(email, password)
      analytics.trackSignup(data.user)
      router.replace({
        pathname: '/(protected)/(tabs)',
      })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <YStack flex={1} p="$4" gap="$4">
      <YStack flex={1} justify="center" gap="$4">
        <H1>Create Account</H1>
        <Paragraph>Sign up to get started</Paragraph>

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
          onChangeText={(text) => {
            setPassword(text)
            setPasswordError('')
          }}
          secureTextEntry
        />

        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text)
            setPasswordError('')
          }}
          secureTextEntry
        />

        {passwordError ? <Paragraph color="$red10">{passwordError}</Paragraph> : null}
        {error ? <Paragraph color="$red10">{error}</Paragraph> : null}

        <Button
          onPress={handleSignup}
          disabled={isLoading || !email || !password || !confirmPassword}
          icon={isLoading ? Spinner : undefined}
          themeInverse
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>

        <Button onPress={() => router.push('/(auth)')} variant="outlined">
          Already have an account? Login
        </Button>
      </YStack>
    </YStack>
  )
}
