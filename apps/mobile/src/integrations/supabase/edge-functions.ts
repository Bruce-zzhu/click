import { supabase } from "./index";

export const handleMessageReply = async (prompt: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  const { error } = await supabase.functions.invoke("reply-ai-chat", {
    body: { prompt },
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (error) throw error;
};

export const fetchStreamToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const { data, error } = await supabase.functions.invoke(
    "generate-stream-token",
    {
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    },
  );
  if (error) throw error;

  return data.token;
};
