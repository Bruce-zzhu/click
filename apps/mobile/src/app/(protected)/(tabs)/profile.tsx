import { analytics } from '@app/integrations/mixpanel/analytics'
import { Screen } from '@app/providers/ScreenProvider'
import { useAuthStore } from '@app/store/authStore'
import { useToastController } from '@tamagui/toast'
import { Button, H2, Paragraph, YStack } from 'tamagui'

export default function SettingsScreen() {
  const { logout } = useAuthStore()
  const toast = useToastController()
  const user = useAuthStore((state) => state.user)

  const handleLogout = async () => {
    try {
      await logout()
      analytics.trackLogout()
    } catch (err) {
      toast.show('Failed to logout, please try again', {
        type: 'error',
      })
    }
  }

  return (
    <Screen>
      <YStack flex={1} items="center" justify="center" bg="$background">
        <H2>Profile</H2>
        <Paragraph>{user?.email}</Paragraph>

        <Button my="$6" onPress={handleLogout}>
          Logout
        </Button>
      </YStack>
    </Screen>
  )
}
