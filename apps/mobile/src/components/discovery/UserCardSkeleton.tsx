import { Skeleton } from 'moti/skeleton'
import { Card, useWindowDimensions, XStack, YStack } from 'tamagui'

export function UserCardSkeleton() {
  return (
    <Card p="$4" mb="$2" elevate>
      <XStack items="center" gap="$3">
        {/* Avatar Skeleton */}
        <Skeleton colorMode="light" height={48} width={48} radius={24} />
        <YStack gap="$2">
          {/* Name Skeleton */}
          <Skeleton colorMode="light" height={16} width={120} radius={6} />
          {/* Email Skeleton */}
          <Skeleton colorMode="light" height={20} width={180} radius={6} />
        </YStack>
      </XStack>
    </Card>
  )
}

export function UserCardSkeletonList() {
  const { height } = useWindowDimensions()
  // Estimate how many cards fit on the screen (adjust as needed)
  const cardHeight = 80
  const numCards = Math.ceil(height / cardHeight) + 2

  return (
    <YStack flex={1} bg="$background" p="$4">
      {[...Array(numCards)].map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </YStack>
  )
}
