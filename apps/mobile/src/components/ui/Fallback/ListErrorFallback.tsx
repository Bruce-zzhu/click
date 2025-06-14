import { RefreshCw } from '@tamagui/lucide-icons'
import { Button, Text, YStack } from 'tamagui'

type ListErrorFallbackProps = {
  message?: string
  onRetry?: () => void
}

export function ListErrorFallback({
  message = 'Something went wrong while loading :/',
  onRetry,
}: ListErrorFallbackProps) {
  return (
    <YStack flex={1} justify="center" items="center" px="$4" gap="$3" bg="$background">
      <Text fontSize="$6">{message}</Text>
      {onRetry && (
        <Button icon={RefreshCw} size="$4" onPress={onRetry}>
          Retry
        </Button>
      )}
    </YStack>
  )
}
