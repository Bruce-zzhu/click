import { OpenAI } from "openai";
import type {
  AIMessage,
  AIProvider,
  AIStreamResponse,
} from "../model-config.ts";
import { AVAILABLE_MODELS, MODEL_PROVIDERS } from "../model-config.ts";

export class DeepSeekProvider implements AIProvider {
  name = MODEL_PROVIDERS.DEEPSEEK;
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey,
    });
  }

  async *streamChat(messages: AIMessage[]): AsyncIterable<AIStreamResponse> {
    const modelConfig = AVAILABLE_MODELS.deepseek;

    const stream = await this.client.chat.completions.create({
      model: modelConfig.model,
      stream: true,
      messages: messages,
      max_tokens: modelConfig.maxTokens,
    });

    for await (const chunk of stream) {
      const delta = chunk?.choices?.[0]?.delta?.content ?? "";
      if (delta) {
        yield {
          content: delta,
          done: false,
        };
      }
    }

    yield {
      content: "",
      done: true,
    };
  }
}
