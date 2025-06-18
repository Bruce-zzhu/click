export const CHAT_BOT = {
  ID: "ai-chat-bot",
  NAME: "Click AI Assistant",
  ROLE: "user",
  AVATAR: "https://api.dicebear.com/7.x/bottts/svg?seed=ai-assistant",
} as const;

export const STREAM_CHAT = {
  CHANNEL_TYPE: "messaging",
  AI_EVENTS: {
    INDICATOR_UPDATE: "ai_indicator.update",
    INDICATOR_CLEAR: "ai_indicator.clear",
  },
  AI_STATES: {
    ERROR: "AI_STATE_ERROR",
    EXTERNAL_SOURCES: "AI_STATE_EXTERNAL_SOURCES",
    GENERATING: "AI_STATE_GENERATING",
    IDLE: "AI_STATE_IDLE",
    THINKING: "AI_STATE_THINKING",
  },
} as const;
