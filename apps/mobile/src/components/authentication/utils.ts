const SIGNUP_VS_LOGIN_THRESHOLD_MS = 3000 // 3 seconds

/**
 * Determines if a user action is a signup or login from OAuth based on timestamps.
 * @param user The user object from Supabase auth, containing created_at and last_sign_in_at.
 * @returns 'signup' if it's likely a new registration, 'login' otherwise.
 */
export function getAuthActionFromUser(user: {
  created_at?: string
  last_sign_in_at?: string
}): 'signup' | 'login' {
  if (!user || !user.created_at) {
    // Fallback or error, though user object should always have created_at
    console.warn('getAuthActionFromUser: User object or created_at is missing.')
    return 'login' // Default to login if data is insufficient
  }

  const createdAtTime = new Date(user.created_at).getTime()

  // If last_sign_in_at is not present or is null/undefined, it's very likely a new user.
  // Also, handle cases where last_sign_in_at might be the same as created_at initially.
  const lastSignInAtTime = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).getTime()
    : createdAtTime // Treat missing last_sign_in_at as if it's the creation time

  if (Math.abs(lastSignInAtTime - createdAtTime) < SIGNUP_VS_LOGIN_THRESHOLD_MS) {
    return 'signup'
  }

  return 'login'
}
