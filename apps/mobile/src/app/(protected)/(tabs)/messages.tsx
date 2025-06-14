import { Screen } from '@app/providers/ScreenProvider'
import { useWindowDimensions } from 'react-native'
import { Card, Text, YStack } from 'tamagui'
export default function MessagesScreen() {
  const { width } = useWindowDimensions()

  return (
    <Screen>
      <YStack flex={1} items="center" justify="center" bg="$background" p="$4">
        <Card width={width * 0.9} p="$6">
          <Text fontSize="$8" fontWeight="700">
            Messages
          </Text>
          <Text mt="$3" fontSize="$5" color="$color">
            Your messages will appear here.
          </Text>
        </Card>
      </YStack>
    </Screen>
  )
}
