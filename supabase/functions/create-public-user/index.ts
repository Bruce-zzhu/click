import { TABLES } from '../_shared/constants.ts'
import { supabaseAdmin } from '../_shared/init.ts'

/**
 * This function should be called when a row is inserted into the auth.users table.
 * It creates a public user in the public.users table if one does not already exist.
 */
Deno.serve(async (req) => {
  try {
    const data = await req.json()
    const user = data.record

    const authUserId = user.id
    const email = user.email

    // Check if a public user already exists for this auth_uid
      const { data: existingUser } = await supabaseAdmin
        .from(TABLES.USERS.name)
        .select(TABLES.USERS.columns.id)
      .eq('auth_uid', authUserId)
        .maybeSingle()

      if (existingUser) {
      return new Response('User already exists', { status: 200 })
    }

    // Create a new public.users record
      const username = await generateDefaultUsername(email)

      const { data: newUser, error: userError } = await supabaseAdmin
        .from(TABLES.USERS.name)
        .insert([
          {
            auth_uid: authUserId,
            email,
            username,
          },
        ])
        .select(TABLES.USERS.columns.id)
        .single()

      if (userError || !newUser) {
        throw new Error('Failed to create new user row')
      }

    return new Response('User created', { status: 200 })
  } catch (err) {
    console.error('[Edge Error]', err)
    return new Response('Internal Server Error', { status: 500 })
  }
})

async function generateDefaultUsername(email: string): Promise<string> {
  const username = `user_${crypto.randomUUID().slice(0, 8)}`

  let attempts = 0
  const maxAttempts = 5

  // Check if the username is already taken
  while (attempts < maxAttempts) {
    const { data: existingUser } = await supabaseAdmin
      .from(TABLES.USERS.name)
      .select(TABLES.USERS.columns.id)
      .eq(TABLES.USERS.columns.username, username)
      .maybeSingle()

    if (!existingUser) {
      return username
    }

    attempts++
  }

  return email
}
