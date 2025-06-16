import { CircleUserRound, MessagesSquare, Telescope } from '@tamagui/lucide-icons'
import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'

export default function TabsLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.blue10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Telescope color={color as any} />,
          headerRight: () => (
            <Link href="/(protected)/modal" asChild>
              <Button mr="$4">Hello!</Button>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <MessagesSquare color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color }) => <CircleUserRound color={color as any} />,
        }}
      />
    </Tabs>
  )
}
