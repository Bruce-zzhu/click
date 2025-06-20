# Reply AI Chat Function

## Overview

`reply-ai-chat` is a Supabase Edge Function (Deno runtime) that streams AI-generated replies to a Stream Chat channel.  
It supports **pluggable models/providers** – currently DeepSeek and AWS Bedrock (Claude Sonnet 4).

---

## Supported Providers & Models

| Key (`model` field) | Provider | Model ID (constant) | Notes |
| ------------------- | -------- | ------------------- | ----- |
| `deepseek` *(default)* | DeepSeek | `deepseek-chat` | 8K context, low-cost |
| `claude_sonnet_4` | AWS Bedrock | `us.anthropic.claude-sonnet-4-20250514-v1:0` | 200K ctx, cross-region inference profile |

> ℹ️  Model IDs live in `model-config.ts → AVAILABLE_MODELS` so you never hard-code them elsewhere.

### Required environment variables

| Provider | Variables |
| -------- | --------- |
| DeepSeek | `DEEPSEEK_API_KEY` |
| Bedrock  | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |

Add them to the Supabase **Edge Function secrets** or your local `.env`.

---

## Request Schema

```jsonc
POST /reply-ai-chat
{
  "prompt": "<user text>",      // required
  "model": "claude_sonnet_4"    // optional, defaults to "deepseek"
}
```

The response is always `{ ok: true }`; text is streamed directly into the user's Stream channel via events.

---

## Implementation Notes

1. **Provider Factory** – `provider-factory.ts` instantiates the correct provider based on `AVAILABLE_MODELS`.
2. **Custom HTTP Handler** – Bedrock provider uses `FetchHttpHandler` to avoid the *broken pipe* bug in Deno's `node:http2` polyfill.
3. **Streaming** – Providers yield `{ content, done }` chunks; `index.ts` updates the placeholder message every ~20 tokens.
4. **Typing Indicators** – Function publishes `ai_indicator.update/clear` events so the UI can show *thinking / generating* states.

---

## Troubleshooting

| Error | Cause | Fix |
| ----- | ----- | --- |
| `ValidationException: Invocation of model ID ... isn't supported` | Direct model ID used instead of inference profile | Ensure the ID starts with `us.` / `eu.` / `apac.` prefix |
| `stream closed because of a broken pipe` | SDK's Node HTTP/2 handler breaks in Deno | We now use `FetchHttpHandler`; redeploy the function |
| `403 AccessDeniedException` | Bedrock model not enabled | Request model access in AWS Console ➜ Bedrock ➜ Model access |

---

## Local Development

```bash
# 1. Install deps
pnpm install

# 2. Build TS assets (mobile app step)
just prebuild  # optional for edge-only work

# 3. Deploy Edge Func locally
supabase functions serve reply-ai-chat --env-file supabase/.env.local
```

The `serve` command hot-reloads on file save.

---

## Deployment

```bash
supabase functions deploy reply-ai-chat \
  --env-file supabase/.env.production
```

CI runs `supabase functions deploy` on merge to `main`.

---

## Available Models
- deepseek (default): DeepSeek chat model
- claude_sonnet_4: AWS Bedrock Claude Sonnet 4 