import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { FetchHttpHandler } from "@smithy/fetch-http-handler";
import type {
  AIMessage,
  AIProvider,
  AIStreamResponse,
} from "../model-config.ts";
import { AVAILABLE_MODELS, MODEL_PROVIDERS } from "../model-config.ts";

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string;
}

interface AnthropicRequest {
  anthropic_version: string;
  max_tokens: number;
  messages: AnthropicMessage[];
  system?: string;
  temperature?: number;
}

export class BedrockProvider implements AIProvider {
  name = MODEL_PROVIDERS.BEDROCK;
  private client: BedrockRuntimeClient;

  constructor(accessKeyId: string, secretAccessKey: string, region: string) {
    this.client = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      requestHandler: new FetchHttpHandler(),
    });
  }

  async *streamChat(messages: AIMessage[]): AsyncIterable<AIStreamResponse> {
    const modelConfig = AVAILABLE_MODELS.claude_sonnet_4;

    // Separate system messages from conversation messages
    const systemMessage = messages.find((msg) => msg.role === "system")
      ?.content;
    const conversationMessages = messages.filter((msg) =>
      msg.role !== "system"
    );

    const requestBody: AnthropicRequest = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: modelConfig.maxTokens,
      messages: conversationMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })),
      temperature: modelConfig.temperature,
    };

    if (systemMessage) {
      requestBody.system = systemMessage;
    }

    const command = new InvokeModelWithResponseStreamCommand({
      modelId: modelConfig.model,
      body: JSON.stringify(requestBody),
      contentType: "application/json",
      accept: "application/json",
    });

    try {
      const response = await this.client.send(command);

      if (!response.body) {
        throw new Error("No response body from Bedrock");
      }

      for await (const chunk of response.body) {
        if (chunk.chunk?.bytes) {
          const decoder = new TextDecoder();
          const chunkData = decoder.decode(chunk.chunk.bytes);

          try {
            const parsed = JSON.parse(chunkData);

            // Handle different chunk types from Claude
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              yield {
                content: parsed.delta.text,
                done: false,
              };
            } else if (parsed.type === "message_stop") {
              yield {
                content: "",
                done: true,
              };
              return;
            }
          } catch (parseError) {
            console.warn("Failed to parse Bedrock chunk:", parseError);
          }
        }
      }
    } catch (error) {
      console.error("Bedrock streaming error:", error);
      throw new Error(
        `Bedrock API error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }

    yield { content: "", done: true };
  }
}
