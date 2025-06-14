import '@tamagui/toast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

declare module '@tamagui/toast' {
  interface CustomData {
    type?: ToastType
  }
}
