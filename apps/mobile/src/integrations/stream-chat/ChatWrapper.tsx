/**
 * Wrapper for the Stream Chat client.
 * Example: https://github.com/GetStream/stream-chat-react-native/tree/develop/examples/ExpoMessaging
 */

import { createContext, useContext } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StreamChat } from 'stream-chat';
import {
  Channel,
  Chat,
  MessageTextContainer,
  OverlayProvider,
  Streami18n,
  useChannelContext,
  useChatContext
} from 'stream-chat-expo';
import { Spinner } from 'tamagui';
import { useInitStreamChat } from './useInitStreamChat';
import { useStreamChatTheme } from './useStreamChatTheme';

const streami18n = new Streami18n({
  language: 'en',
});

const streamClient = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

// ------------------------------------------------------------
// Master Stream Chat Context
// ------------------------------------------------------------

const StreamChatContext = createContext<{
  connectStreamUser: () => Promise<void>;
  channelContext: ReturnType<typeof useChannelContext> | null
  chatContext: ReturnType<typeof useChatContext> | null
}>({
  connectStreamUser: async () => { },
  channelContext: null,
  chatContext: null,
});

/**
 * Consolidate all the stream chat context providers
 */
const StreamChatProvider = ({ children, connectStreamUser }: {
  children: React.ReactNode
  connectStreamUser: () => Promise<void>
}) => {
  const chatContext = useChatContext()
  const channelContext = useChannelContext()

  return (
    <StreamChatContext.Provider value={{ connectStreamUser, channelContext, chatContext }}>
      {children}
    </StreamChatContext.Provider>
  )
}

/**
 * Consolidate all the stream chat context providers
 */
export const useStreamChatContext = () => {
  const {
    channelContext,
    chatContext,
    ...rest
  } = useContext(StreamChatContext)

  return {
    channelContext: channelContext as ReturnType<typeof useChannelContext>,
    chatContext: chatContext as ReturnType<typeof useChatContext>,
    ...rest
  }
}

// ------------------------------------------------------------
// Stream Chat Wrapper
// ------------------------------------------------------------

export function StreamChatWrapper({ children }: { children: React.ReactNode }) {
  const { bottom } = useSafeAreaInsets();
  const theme = useStreamChatTheme();

  const { channel, connectStreamUser } = useInitStreamChat(streamClient)

  const StreamedMessageText = (props) => {
    // const { message: messageFromContext } = useMessageContext();
    // const { text = "" } =  messageFromContext;
    // const { streamedMessageText } = useStreamingMessage({
    //   renderingLetterCount: 2,
    //   letterInterval: 30,
    //   text,
    // });
    return (
      <MessageTextContainer {...props} />
    );
  };


  if (!streamClient || !channel) {
    return <Spinner size="large" />
  }

  return (
    <OverlayProvider
      bottomInset={bottom}
      i18nInstance={streami18n}
      value={{ style: theme }}
    >
      <Chat client={streamClient} i18nInstance={streami18n} isMessageAIGenerated={(message) => !!(message as any).ai_generated}>
        <Channel channel={channel} StreamingMessageView={StreamedMessageText}>
          <StreamChatProvider connectStreamUser={connectStreamUser}>
            {children}
          </StreamChatProvider>
        </Channel>
      </Chat>
    </OverlayProvider>
  );
};

