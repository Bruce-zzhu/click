/**
 * Wrapper for the Stream Chat client.
 * Example: https://github.com/GetStream/stream-chat-react-native/tree/develop/examples/ExpoMessaging
 */

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Chat,
  OverlayProvider,
  Streami18n,
  useCreateChatClient
} from 'stream-chat-expo';
import { Spinner } from 'tamagui';
import { useStreamChatTheme } from './useStreamChatTheme';


const streami18n = new Streami18n({
  language: 'en',
});


export function ChatWrapper({ children }: { children: React.ReactNode }) {
  const { bottom } = useSafeAreaInsets();


  const chatClient = useCreateChatClient({
    apiKey: 'q95x9hkbyd6p',
    userData: { id: "ron" },
    tokenOrProvider: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoicm9uIn0.eRVjxLvd4aqCEHY_JRa97g6k7WpHEhxL7Z4K4yTot1c',
  });

  const theme = useStreamChatTheme();

  if (!chatClient) {
    return <Spinner size="large" />
  }

  return (
    <OverlayProvider
      bottomInset={bottom}
      i18nInstance={streami18n}
      value={{ style: theme }}
    >
      <Chat client={chatClient} i18nInstance={streami18n}>
        {children}
      </Chat>
    </OverlayProvider>
  );
};