module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: false,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],

      // NOTE: this is only necessary if you are using reanimated for animations
      'react-native-reanimated/plugin',

      // Module resolver for path aliases
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@app/*': 'src/*',
            '@app/assets/*': 'assets/*',
          },
        },
      ],
    ],
  }
}
