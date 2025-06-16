import { ChatWrapper } from '@app/integrations/stream-chat/ChatWrapper';
import { Screen } from '@app/providers/ScreenProvider';
import { useEffect, useState } from 'react';
import { Channel as TChannel } from 'stream-chat';
import { Channel, MessageInput, MessageList, useChatContext } from 'stream-chat-expo';
import { Spinner } from 'tamagui';


const ChatChannel = () => {
  const { client } = useChatContext()
  const [channel, setChannel] = useState<TChannel | null>(null);

  useEffect(() => {
    const createAndWatchChannel = async () => {
      const newChannel = client.channel("messaging", "channel_id");
      await newChannel.watch();
      setChannel(newChannel);
    };
    createAndWatchChannel();
  }, []);

  if (!channel) {
    return <Spinner />
  }

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  )
}


export default function MessagesScreen() {



  return (
    <ChatWrapper>
      <Screen>
        <ChatChannel />
      </Screen>
    </ChatWrapper>
  )
}
