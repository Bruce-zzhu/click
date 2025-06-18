import { useConnectionTimeout } from '@app/components/primary-chat/useConnectionTimeout';
import { useStreamChatContext } from '@app/integrations/stream-chat/ChatWrapper';
import { STREAM_CHAT } from '@app/integrations/stream-chat/constants';
import { supabase } from '@app/integrations/supabase';
import { useAuthStore } from '@app/store/authStore';
import React, { useEffect } from 'react';
import { AITypingIndicatorView, MessageInput, MessageList } from 'stream-chat-expo';


const handleMessage = async (prompt: string, sessionToken: string) => {
  await supabase.functions.invoke('reply-ai-chat', {
    body: { prompt },
    headers: { Authorization: `Bearer ${sessionToken}` },
  });
};

export const ChatView = () => {
  useConnectionTimeout();
  const sessionToken = useAuthStore((s) => s.token) as string;

  const { channelContext } = useStreamChatContext();

  const userId = useAuthStore((s) => s.user?.id);

  // Listen for new user messages → trigger AI response
  useEffect(() => {
    const channel = channelContext?.channel;
    if (!channel || !userId) return;

    const handleNewMessage = async (event: any) => {
      const msgUserId = event.message?.user?.id;
      if (msgUserId !== userId) return; // only react to current user's messages

      try {
        // Optimistic UI: show thinking indicator immediately
        await channel.sendEvent({
          type: STREAM_CHAT.AI_EVENTS.INDICATOR_UPDATE,
          ai_state: STREAM_CHAT.AI_STATES.THINKING,
        });

        handleMessage(event.message.text, sessionToken);
      } catch (err) {
        console.error('[ai-chat invoke] failed', err);
      }
    };

    channel.on('message.new', handleNewMessage);
    return () => {
      channel.off('message.new', handleNewMessage);
    };
  }, [channelContext?.channel, userId]);

  return (
    <React.Fragment>
      <MessageList />
      <AITypingIndicatorView />
      <MessageInput />
    </React.Fragment>
  );
}
