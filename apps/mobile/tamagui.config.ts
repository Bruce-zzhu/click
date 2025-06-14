import { defaultConfig } from '@tamagui/config/v4'
import { themes } from '@tamagui/themes'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  themes,
  onlyAllowShorthands: false,
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
