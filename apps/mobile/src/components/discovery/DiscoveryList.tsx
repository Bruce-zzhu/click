import { UserCardSkeletonList } from '@app/components/discovery/UserCardSkeleton'
import { ListErrorFallback } from '@app/components/ui/Fallback/ListErrorFallback'
import { useUserList } from '@app/services/hooks/user/useUserList'
import { FlatList } from 'react-native'
import { Spinner, YStack } from 'tamagui'
import { UserCard } from './UserCard'

export const DiscoveryList = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useUserList()

  const users = data?.pages.flat() ?? []

  if (users.length === 0 && isLoading) {
    return <UserCardSkeletonList />
  }

  if (error) {
    return <ListErrorFallback onRetry={() => fetchNextPage()} />
  }

  return (
    <YStack flex={1} bg="$background" p="$2" gap="$4">
      <FlatList
        data={users}
        keyExtractor={(user) => user.id}
        renderItem={({ item: user }) => <UserCard key={user.id} user={user} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage()
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isFetchingNextPage ? (
            <YStack py="$4" items="center">
              <Spinner size="small" color="$color" />
            </YStack>
          ) : null
        }
      />
    </YStack>
  )
}
