import { CHAT_BOT, STREAM_CHAT } from "@/constants.ts";
import { streamServerClient, supabaseClient } from "@/init.ts";
import { type AIMessage, getModelConfig } from "./model-config.ts";
import { createProvider } from "./provider-factory.ts";

// -----------------------------------------------------------------------------
// Main edge function
// -----------------------------------------------------------------------------
Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // -------------------------------------------------------------------------
    // 1. Auth: extract Supabase session to identify the caller -> user.id
    // -------------------------------------------------------------------------
    const jwt = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!jwt) {
      return new Response(JSON.stringify({ error: "Missing bearer token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: { user }, error: userError } = await supabaseClient.auth
      .getUser(jwt);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // -------------------------------------------------------------------------
    // 2. Parse request body
    // -------------------------------------------------------------------------
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // -------------------------------------------------------------------------
    // 3. Initialize AI provider
    // -------------------------------------------------------------------------
    let modelConfig;
    let provider;

    try {
      modelConfig = getModelConfig();
      provider = createProvider(modelConfig);
    } catch (providerError) {
      console.error("[ai-chat] Provider initialization error:", providerError);
      const errorMessage = providerError instanceof Error
        ? providerError.message
        : "Unknown provider error";
      return new Response(
        JSON.stringify({
          error: `AI provider error: ${errorMessage}`,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // -------------------------------------------------------------------------
    // 4. Get user's AI chat channel from metadata
    // -------------------------------------------------------------------------
    const channelId = user.user_metadata?.ai_chat_channel_id;
    if (!channelId) {
      return new Response(
        JSON.stringify({
          error: "AI chat not set up. Please call setup-ai-chat first.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Get the existing channel
    const channel = streamServerClient.channel(
      STREAM_CHAT.CHANNEL_TYPE,
      channelId,
    );

    // -------------------------------------------------------------------------
    // 5. Typing / thinking indicator
    // -------------------------------------------------------------------------
    await channel.sendEvent({
      type: STREAM_CHAT.AI_EVENTS.INDICATOR_UPDATE,
      ai_state: STREAM_CHAT.AI_STATES.THINKING,
      user_id: CHAT_BOT.ID,
    });

    // -------------------------------------------------------------------------
    // 6. Placeholder message
    // -------------------------------------------------------------------------
    const { message: placeholder } = await channel.sendMessage({
      text: "",
      user_id: CHAT_BOT.ID,
      // @ts-ignore: custom field
      ai_generated: true,
    });

    // Switch indicator to generating
    await channel.sendEvent({
      type: STREAM_CHAT.AI_EVENTS.INDICATOR_UPDATE,
      ai_state: STREAM_CHAT.AI_STATES.GENERATING,
      message_id: placeholder.id,
      user_id: CHAT_BOT.ID,
    });

    // -------------------------------------------------------------------------
    // 7. Stream from AI provider
    // -------------------------------------------------------------------------
    const messages: AIMessage[] = [
      { role: "system", content: "You are a helpful assistant" },
      { role: "user", content: prompt },
    ];

    let full = "";
    let chunkIndex = 0;

    for await (const response of provider.streamChat(messages)) {
      if (response.done) break;

      const delta = response.content;
      if (!delta) continue;

      full += delta;
      chunkIndex++;

      if (chunkIndex % 20 === 0 || chunkIndex < 8) {
        await streamServerClient.partialUpdateMessage(
          placeholder.id,
          { set: { text: full } },
          CHAT_BOT.ID,
        );
      }
    }

    // Final update
    await streamServerClient.partialUpdateMessage(
      placeholder.id,
      { set: { text: full } },
      CHAT_BOT.ID,
    );

    await channel.sendEvent({
      type: STREAM_CHAT.AI_EVENTS.INDICATOR_CLEAR,
      message_id: placeholder.id,
      user_id: CHAT_BOT.ID,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[ai-chat] unexpected error", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
