import { ChatView } from '@app/components/primary-chat/ChatView';
import { StreamChatWrapper } from '@app/integrations/stream-chat/ChatWrapper';
import { Screen } from '@app/providers/ScreenProvider';

export default function MessagesScreen() {

  return (
    <StreamChatWrapper>
      <Screen>
        <ChatView />
      </Screen>
    </StreamChatWrapper>
  )
}
