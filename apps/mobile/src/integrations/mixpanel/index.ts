// Example: https://github.com/mixpanel/mixpanel-react-native/blob/master/Samples/MixpanelExpo/App.js
// Src: https://github.com/mixpanel/mixpanel-react-native/blob/master/javascript/mixpanel-main.js
// API ref: https://mixpanel.github.io/mixpanel-react-native/Mixpanel.html

import { Mixpanel } from 'mixpanel-react-native'

const PROJECT_TOKEN = process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN as string

const trackAutomaticEvents = false //disable legacy mobile autotrack
const useNative = false //disable Native Mode, use Javascript Mode

// create new Mixpanel class
export const mixpanel = new Mixpanel(PROJECT_TOKEN, trackAutomaticEvents, useNative)

mixpanel.init()

// For debugging
// mixpanel.setLoggingEnabled(true)
