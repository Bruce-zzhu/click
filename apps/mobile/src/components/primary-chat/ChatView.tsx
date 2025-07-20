import { useConnectionTimeout } from '@app/components/primary-chat/useConnectionTimeout';
import { useStreamChatContext } from '@app/integrations/stream-chat/ChatWrapper';
import { STREAM_CHAT } from '@app/integrations/stream-chat/constants';
import { handleMessageReply } from '@app/integrations/supabase/edge-functions';
import { useAuthStore } from '@app/store/authStore';
import React, { useEffect } from 'react';
import { AITypingIndicatorView, MessageInput, MessageList } from 'stream-chat-expo';

export const ChatView = () => {
  useConnectionTimeout();

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

        await handleMessageReply(event.message.text);
      } catch (err) {
        console.error('[ai-chat invoke] failed', err);
        // Terminate thinking indicator
        await channel.sendEvent({
          type: STREAM_CHAT.AI_EVENTS.INDICATOR_CLEAR,
        });
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
};
