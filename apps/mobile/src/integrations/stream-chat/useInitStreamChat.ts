import { useAuthStore } from "@app/store/authStore";
import { useEffect, useState, useTransition } from "react";
import { Channel, StreamChat } from "stream-chat";
import { supabase } from "../supabase";
import { CHAT_BOT } from "./constants";

const fetchStreamToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No Supabase session");

  const { data, error } = await supabase.functions.invoke(
    "generate-stream-token",
    { headers: { Authorization: `Bearer ${session.access_token}` } },
  );
  if (error) throw error;

  return data.token;
};

function generateChannelId(userId: string): string {
  return `${CHAT_BOT.ID}-${userId}`;
}

export const useInitStreamChat = (streamClient: StreamChat) => {
  const [isLoading, startTransition] = useTransition();
  const [channel, setChannel] = useState<Channel | null>(null);

  const userId = useAuthStore((state) => state.user?.id) as string;
  const userName = useAuthStore((state) => state.user?.email);

  useEffect(() => {
    startTransition(async () => {
      try {
        await connectStreamUser();
        await connectChannel();
      } catch (error) {
        console.error(error);
      }
    });

    return () => {
      streamClient.disconnectUser();
      channel?.stopWatching();
      setChannel(null);
    };
  }, []);

  const connectStreamUser = async () => {
    await streamClient.connectUser(
      { id: userId, name: userName },
      // 👉 tokenProvider:
      async () => {
        // called immediately, and again whenever the old token expires
        return fetchStreamToken();
      },
    );
  };

  // Channel is created in backend, here we just connect to it
  const connectChannel = async () => {
    const channelId = generateChannelId(userId);
    const newChannel = streamClient.channel("messaging", channelId, {
      members: [CHAT_BOT.ID, userId],
    });
    await newChannel.watch();
    setChannel(newChannel);
  };

  return { isLoading, channel, connectStreamUser };
};
