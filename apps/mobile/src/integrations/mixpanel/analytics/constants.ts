export const EVENT_NAMES = {
  SIGNUP: 'Sign Up',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  APP_OPEN: 'App Open',
} as const

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES]

export const EVENT_PROPERTIES = {
  appVersion: 'App Version',
  authProvider: 'Auth Provider',
} as const

export const USER_PROPERTIES = {
  createdAt: 'Created At',
} as const
