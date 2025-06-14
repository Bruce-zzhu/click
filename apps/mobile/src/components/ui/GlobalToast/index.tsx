import { AlertTriangle, CheckCircle2, Info, XCircle } from '@tamagui/lucide-icons'
import { CustomData, Toast, ToastViewport, useToastState } from '@tamagui/toast'
import { XStack, YStack, type ColorTokens } from 'tamagui'

interface ToastTheme {
  bg: ColorTokens
  titleColor: ColorTokens
  textColor: ColorTokens
  icon: React.ReactNode
}

const toastThemes: Record<NonNullable<CustomData['type']>, ToastTheme> = {
  success: {
    bg: '$green3',
    titleColor: '$green12',
    textColor: '$green11',
    icon: <CheckCircle2 size={18} color="$green11" />,
  },
  error: {
    bg: '$red3',
    titleColor: '$red12',
    textColor: '$red11',
    icon: <XCircle size={18} color="$red11" />,
  },
  warning: {
    bg: '$yellow3',
    titleColor: '$yellow12',
    textColor: '$yellow11',
    icon: <AlertTriangle size={18} color="$yellow11" />,
  },
  info: {
    bg: '$blue3',
    titleColor: '$blue12',
    textColor: '$blue11',
    icon: <Info size={18} color="$blue11" />,
  },
}

export function GlobalToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  const type = currentToast?.type || currentToast?.customData?.type || 'success'
  const theme = toastThemes[type]

  return (
    <>
      <Toast
        key={currentToast.id}
        duration={currentToast.duration ?? 2000}
        viewportName={currentToast.viewportName}
        enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
        exitStyle={{ opacity: 0, scale: 1, y: -20 }}
        y="$4"
        rounded="$4"
        animation="quick"
        bg={theme.bg}
      >
        <YStack items="flex-start" gap="$1">
          <XStack items="center" gap="$2">
            {theme.icon}
            <Toast.Title color={theme.titleColor}>{currentToast.title}</Toast.Title>
          </XStack>
          {!!currentToast.message && (
            <Toast.Description color={theme.textColor}>
              {currentToast.message}
            </Toast.Description>
          )}
        </YStack>
      </Toast>
      <ToastViewport top="$8" left={0} right={0} />
    </>
  )
}
