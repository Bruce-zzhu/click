import { ReactNode } from 'react'
import { SafeAreaView } from 'react-native'

interface ScreenProps {
  children: ReactNode
  testID?: string
}

export function Screen({ children, testID }: ScreenProps) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      testID={testID}
      accessible
      accessibilityRole="summary"
    >
      {children}
    </SafeAreaView>
  )
}
