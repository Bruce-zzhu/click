import {
    EVENT_NAMES,
    EVENT_PROPERTIES,
    USER_PROPERTIES,
} from '@app/integrations/mixpanel/analytics/constants'
import * as mixpFunc from '@app/integrations/mixpanel/functions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@supabase/supabase-js'
import Constants from 'expo-constants'

export const registerSuperProperties = (user: User) => {
  mixpFunc.registerSuperProperties({
    $email: user.email,
    [EVENT_PROPERTIES.appVersion]: Constants.expoConfig?.version ?? 'unknown',
  })
}

export const trackSignup = (user: User | null) => {
  if (!user) return
  // Create user profile
  mixpFunc.identify(user.id)
  mixpFunc.setUserProperties({
    $email: user.email,
    [USER_PROPERTIES.createdAt]: user.created_at,
  })
  // Signup event
  mixpFunc.track(EVENT_NAMES.SIGNUP, {
    [EVENT_PROPERTIES.authProvider]: user.app_metadata?.provider,
  })
}

export const trackLogin = (user: User | null, auth: 'Google' | 'Apple' | 'Email') => {
  if (!user) return
  mixpFunc.identify(user.id)
  mixpFunc.track(EVENT_NAMES.LOGIN, {
    [EVENT_PROPERTIES.authProvider]: auth,
  })
}

export const trackLogout = () => {
  mixpFunc.track(EVENT_NAMES.LOGOUT)
  mixpFunc.flush()
  mixpFunc.reset()
}

export const trackAppOpen = async (userId: string) => {
  // Only track app open once per day
  mixpFunc.identify(userId)
  const LAST_APP_OPEN_KEY = `last_app_open_date_${userId}`
  try {
    const lastTrackedDate = await AsyncStorage.getItem(LAST_APP_OPEN_KEY)
    const today = new Date().toDateString()

    if (lastTrackedDate !== today) {
      // Update the last tracked date
      await AsyncStorage.setItem(LAST_APP_OPEN_KEY, today)
      mixpFunc.track(EVENT_NAMES.APP_OPEN)
    }
  } catch (error) {
    console.error('Error checking app open tracking:', error)
  }
}
