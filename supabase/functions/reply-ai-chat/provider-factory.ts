import {
  getRequiredEnvVars,
  MODEL_PROVIDERS,
  type ModelConfig,
} from "./model-config.ts";
import type { AIProvider } from "./model-config.ts";
import { DeepSeekProvider } from "./providers/deepseek.ts";
import { BedrockProvider } from "./providers/bedrock.ts";
import { SUPABASE_NEV } from "@/constants.ts";

export function createProvider(config: ModelConfig): AIProvider {
  // Validate required environment variables
  const requiredVars = getRequiredEnvVars(config.provider);
  const missingVars = requiredVars.filter((varName) => !Deno.env.get(varName));

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables for ${config.provider}: ${
        missingVars.join(", ")
      }`,
    );
  }

  switch (config.provider) {
    case MODEL_PROVIDERS.DEEPSEEK: {
      const apiKey = Deno.env.get(SUPABASE_NEV.DEEPSEEK_API_KEY)!;
      return new DeepSeekProvider(apiKey);
    }

    case MODEL_PROVIDERS.BEDROCK: {
      const accessKeyId = Deno.env.get(SUPABASE_NEV.AWS_ACCESS_KEY_ID)!;
      const secretAccessKey = Deno.env.get(SUPABASE_NEV.AWS_SECRET_ACCESS_KEY)!;
      const region = Deno.env.get(SUPABASE_NEV.AWS_REGION)!;
      return new BedrockProvider(accessKeyId, secretAccessKey, region);
    }

    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
