import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NativeThemeProvider,
} from '@react-navigation/native'
import { StatusBar, useColorScheme } from 'react-native'
import { TamaguiProvider, Theme, type TamaguiProviderProps } from 'tamagui'
import { config } from '../../tamagui.config'

export function ThemeProvider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config'>) {
  const colorScheme = useColorScheme()

  const tamaguiTheme = colorScheme === 'dark' ? 'dark' : 'light'
  const nativeTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme
  const statusBarStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content'

  return (
    <TamaguiProvider config={config} defaultTheme={tamaguiTheme} {...rest}>
      <Theme name="purple">
        <NativeThemeProvider value={nativeTheme}>
          <StatusBar barStyle={statusBarStyle} />
          {children}
        </NativeThemeProvider>
      </Theme>
    </TamaguiProvider>
  )
}
