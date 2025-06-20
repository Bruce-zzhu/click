import { SUPABASE_NEV } from "@/constants.ts";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIStreamResponse {
  content: string;
  done: boolean;
}

export interface AIProvider {
  name: string;
  streamChat(messages: AIMessage[]): AsyncIterable<AIStreamResponse>;
}

export interface ModelConfig {
  provider: typeof MODEL_PROVIDERS[keyof typeof MODEL_PROVIDERS];
  model: string;
  maxTokens: number;
  temperature?: number;
}

// -----------------------------------------------------------------------------

export const MODEL_PROVIDERS = {
  DEEPSEEK: "deepseek",
  BEDROCK: "bedrock",
} as const;

type AvailableModelKey = "deepseek" | "claude_sonnet_4" | "claude_3_haiku";
export const AVAILABLE_MODELS: Record<AvailableModelKey, ModelConfig> = {
  deepseek: {
    provider: MODEL_PROVIDERS.DEEPSEEK,
    model: "deepseek-chat",
    maxTokens: 500,
    temperature: 0.7,
  },
  claude_sonnet_4: {
    provider: MODEL_PROVIDERS.BEDROCK,
    model: "apac.anthropic.claude-sonnet-4-20250514-v1:0",
    maxTokens: 500,
    temperature: 0.7,
  },
  claude_3_haiku: {
    provider: MODEL_PROVIDERS.BEDROCK,
    model: "anthropic.claude-3-haiku-20240307-v1:0",
    maxTokens: 500,
    temperature: 0.7,
  },
} as const;

// -----------------------------------------------------------------------------

export function getModelConfig(
  modelKey: AvailableModelKey = "claude_3_haiku",
): ModelConfig {
  if (!AVAILABLE_MODELS[modelKey]) {
    console.error(`Unknown model: ${modelKey}`);
    return AVAILABLE_MODELS.deepseek;
  }
  return AVAILABLE_MODELS[modelKey];
}

export function getRequiredEnvVars(
  provider: typeof MODEL_PROVIDERS[keyof typeof MODEL_PROVIDERS],
): string[] {
  switch (provider) {
    case MODEL_PROVIDERS.DEEPSEEK:
      return [SUPABASE_NEV.DEEPSEEK_API_KEY];
    case MODEL_PROVIDERS.BEDROCK:
      return [
        SUPABASE_NEV.AWS_ACCESS_KEY_ID,
        SUPABASE_NEV.AWS_SECRET_ACCESS_KEY,
        SUPABASE_NEV.AWS_REGION,
      ];
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
