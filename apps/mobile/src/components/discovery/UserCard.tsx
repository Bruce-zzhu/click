import { Database } from '@app/integrations/supabase/database.types'
import { Avatar, Card, Text, XStack, YStack } from 'tamagui'

type User = Database['public']['Tables']['users']['Row']

interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card p="$4">
      <XStack items="center" gap="$3">
        <Avatar circular size="$4">
          <Avatar.Image src={undefined} />
          <Avatar.Fallback backgroundColor="$gray5">
            <YStack flex={1} items="center" justify="center">
              <Text fontSize="$8">{user.username[0].toUpperCase()}</Text>
            </YStack>
          </Avatar.Fallback>
        </Avatar>
        <YStack>
          <Text fontSize="$6" fontWeight="500">
            {user.username}
          </Text>
          <Text fontSize="$4" color="$gray10">
            {user.email}
          </Text>
        </YStack>
      </XStack>
    </Card>
  )
}
