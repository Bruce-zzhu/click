import { streamServerClient, supabaseClient } from "@/init.ts";

/**
 * Supabase Edge Function – generate-stream-token
 * ------------------------------------------------
 * Generates a signed Stream Chat user JWT for the currently authenticated
 * Supabase user. The function expects the client to forward its Supabase
 * access-token in the `Authorization: Bearer <token>` header.
 *
 * Flow:
 * 1. Validate the session via `supabaseClient.auth.getUser(jwt)`
 * 2. Create a Stream token bound to the user id (1-hour expiry)
 * 3. Return `{ token }` as JSON
 *
 * Required secrets (set once per project):
 *   supabase secrets set \
 *     STREAM_API_KEY=YOUR_STREAM_API_KEY \
 *     STREAM_API_SECRET=YOUR_STREAM_API_SECRET
 *
 * Example client usage (React / React-Native):
 * -------------------------------------------
 * import { StreamChat } from 'stream-chat';
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 * const { data: { session } } = await supabase.auth.getSession();
 *
 * // Call the edge function to retrieve a Stream token
 * const { data } = await supabase.functions.invoke('generate-stream-token', {
 *   headers: { Authorization: `Bearer ${session!.access_token}` },
 * });
 * const { token } = data as { token: string };
 *
 * // Connect to Stream Chat
 * const chat = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_KEY!);
 * await chat.connectUser({ id: session!.user.id }, token);
 */

Deno.serve(async (req: Request) => {
  try {
    // ▶ 1. Verify caller's Supabase session
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace("Bearer ", "");

    if (!jwt) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // getUser is available in supabase-js v2
    const {
      data: { user },
      error,
    } = await (supabaseClient.auth as any)?.getUser(jwt);

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // ▶ 2. Generate a Stream Chat user token for the authenticated user
    //     (optional) add expiry – 1 hour from now
    const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
    const token = streamServerClient.createToken(user.id, expiresIn);

    // ▶ 3. Return token to caller
    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[generate-stream-token] unexpected error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
