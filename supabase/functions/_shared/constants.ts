export const SUPABASE_NEV = {
  DEEPSEEK_API_KEY: "DEEPSEEK_API_KEY",
  AWS_ACCESS_KEY_ID: "AWS_ACCESS_KEY_ID",
  AWS_SECRET_ACCESS_KEY: "AWS_SECRET_ACCESS_KEY",
  AWS_REGION: "AWS_REGION",
  SUPABASE_URL: "SUPABASE_URL",
  SUPABASE_ANON_KEY: "SUPABASE_ANON_KEY",
  SUPABASE_SERVICE_ROLE_KEY: "SUPABASE_SERVICE_ROLE_KEY",
  STREAM_API_KEY: "STREAM_API_KEY",
  STREAM_API_SECRET: "STREAM_API_SECRET",
} as const;

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

export const TABLE = {
  USERS: {
    name: "users",
    columns: {
      id: "id",
      auth_uid: "auth_uid",
      username: "username",
      email: "email",
      created_at: "created_at",
      updated_at: "updated_at",
      is_deleted: "is_deleted",
    },
  },
};
