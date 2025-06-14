// Examples: https://github.com/mixpanel/mixpanel-react-native/blob/master/Samples/MixpanelExpo/App.js

import { MixpanelProperties, MixpanelType } from 'mixpanel-react-native'
import { EventName } from './analytics/constants'
import { mixpanel } from './index'

/**
 * Resets the Mixpanel instance.
 * This method clears all stored data about the current user and resets the Mixpanel instance to its initial state.
 */
export const reset = () => {
  mixpanel.reset()
}

/**
 * Flushes the Mixpanel instance.
 * This method flushes the Mixpanel instance to ensure that all events are sent to the server.
 */
export const flush = () => {
  mixpanel.flush()
}

export const identify = (userId: string) => {
  mixpanel.identify(userId)
}

export const track = async (eventName: EventName, properties?: MixpanelProperties) => {
  mixpanel.track(eventName, properties)
}

export const setUserProperties = (properties: MixpanelProperties) => {
  mixpanel.getPeople().set(properties)
}

export const setUserOneProperty = (property: string, value: MixpanelType) => {
  mixpanel.getPeople().set(property, value)
}

/**
 * Sets a single user property. If the property already exists, it will not be updated.
 */
export const setUserOnePropertyOnce = (property: string, value: MixpanelType) => {
  mixpanel.getPeople().setOnce(property, value)
}

/**
 * Removes a user property.
 * This method deletes a property from the user's profile.
 */
export const unsetUserProperties = (property: string) => {
  mixpanel.getPeople().unset(property)
}

/**
 * Removes a specific value from a user property.
 * This method deletes a specific value from a list property in the user's profile.
 */
export const removeUserPropertyValue = (property: string, value: MixpanelType) => {
  mixpanel.getPeople().remove(property, value)
}

/**
 * Union user properties with a given value.
 * This method updates a list property by combining the current list with a new value.
 * If the property does not exist, it will be created.
 */
export const unionUserProperties = (property: string, value: Array<MixpanelType>) => {
  mixpanel.getPeople().union(property, value)
}

/**
 * Appends a value to a user property.
 * This method appends a value to a list property in the user's profile.
 */
export const appendUserProperties = (property: string, value: MixpanelType) => {
  mixpanel.getPeople().append(property, value)
}

export const incrementUserProperty = (property: string, value: number) => {
  mixpanel.getPeople().increment(property, value)
}

/**
 * Registers super properties for the Mixpanel.
 * This method sets the super properties that are common to all events tracked for a user.
 */
export const registerSuperProperties = (properties: MixpanelProperties) => {
  mixpanel.registerSuperProperties(properties)
}

export const clearSuperProperties = () => {
  mixpanel.clearSuperProperties()
}

export const unregisterSuperProperty = (propertyName: string) => {
  mixpanel.unregisterSuperProperty(propertyName)
}

export const getSuperProperties = async () => {
  return await mixpanel.getSuperProperties()
}

export const registerSuperPropertiesOnce = (properties: MixpanelProperties) => {
  mixpanel.registerSuperPropertiesOnce(properties)
}

export const optIn = () => {
  mixpanel.optInTracking()
}

export const optOut = () => {
  mixpanel.optOutTracking()
}

export const trackCharge = (amount: number, properties: MixpanelProperties) => {
  mixpanel.getPeople().trackCharge(amount, properties)
}

export const clearCharges = () => {
  mixpanel.getPeople().clearCharges()
}

export const deleteUser = () => {
  mixpanel.getPeople().deleteUser()
}

export const timeEvent = (eventName: EventName, delay: number) => {
  mixpanel.timeEvent(eventName)
  setTimeout(() => {
    mixpanel.track(eventName)
  }, delay)
}
