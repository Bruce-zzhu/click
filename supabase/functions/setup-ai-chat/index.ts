import { CHAT_BOT, STREAM_CHAT } from "@/constants.ts";
import { streamServerClient, supabaseAdmin } from "@/init.ts";

/**
 * This function handles AI bot and channel setup for users.
 * It should be called on user creation.
 * It ensures the bot exists and creates/retrieves the user's AI chat channel.
 */
Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await req.json();
    const user = data.record;

    // Step 1: Ensure AI bot exists
    await ensureAIBot();

    // Step 2: Create the user in Stream Chat
    await ensureUserInStreamChat(user);

    // Step 3: Create channel ID
    const channelId = generateChannelId(user.id);

    // Step 4: Create channel in Stream Chat
    const channel = streamServerClient.channel(
      STREAM_CHAT.CHANNEL_TYPE,
      channelId,
      {
        members: [CHAT_BOT.ID, user.id],
        created_by_id: CHAT_BOT.ID,
      },
    );
    await channel.create();

    // Step 5: Update user metadata with channel info
    const { error: metadataError } = await supabaseAdmin.auth.admin
      .updateUserById(
        user.id,
        {
          user_metadata: {
            ...user.user_metadata,
            ai_chat_channel_id: channelId,
            ai_bot_id: CHAT_BOT.ID,
          },
        },
      );

    if (metadataError) {
      console.error("Failed to update user metadata:", metadataError);
      throw new Error("Failed to save channel metadata");
    }

    console.log(`AI chat channel created: ${channelId} for user: ${user.id}`);

    return new Response(
      JSON.stringify({
        channelId,
        botId: CHAT_BOT.ID,
        message: "Channel created successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[setup-ai-chat] Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/**
 * Ensures the AI bot exists in Stream Chat
 */
async function ensureAIBot(): Promise<void> {
  try {
    await streamServerClient.upsertUser({
      id: CHAT_BOT.ID,
      name: CHAT_BOT.NAME,
      role: "user",
    });
    console.log(`AI bot ${CHAT_BOT.ID} ensured in Stream Chat`);
  } catch (err) {
    console.error("Failed to ensure AI bot:", err);
    throw err;
  }
}

/**
 * Ensures the user exists in Stream Chat
 */
async function ensureUserInStreamChat(user: any): Promise<void> {
  try {
    // Create user in Stream Chat with basic info
    await streamServerClient.upsertUser({
      id: user.id,
      name: user.email, // TODO: change to user's name
      role: "user",
    });
    console.log(`User ${user.id} ensured in Stream Chat`);
  } catch (err) {
    console.error("Failed to ensure user in Stream Chat:", err);
    throw err;
  }
}

/**
 * Generates a deterministic channel ID for user-bot communication
 */
function generateChannelId(userId: string): string {
  return `${CHAT_BOT.ID}-${userId}`;
}
