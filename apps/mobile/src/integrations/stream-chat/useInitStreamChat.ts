import { useEffect, useState } from 'react'
import { Channel } from 'stream-chat'
import { streamClient } from '.'

export const useInitStreamChat = () => {
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [channel, setChannel] = useState<Channel | null>(null)


  // TODO: get user token from supabase
  const userId = 'test-user'
  const userName = 'Test User'
  const agentId = 'agent-1'

  console.log('useInitStreamChat')
  console.log('isReady', isReady)
  console.log('channel', channel)

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true)
        const userToken = streamClient.devToken("test-user")
        // Connect user
        await streamClient.connectUser({
          id: userId,
          name: userName,
        }, userToken)

        // Initialize a simple channel
        const newChannel = streamClient.channel("messaging", {
          members: [userId, agentId],
        });
        await newChannel.watch()

        setChannel(newChannel)
        setIsReady(true)
        setIsLoading(false)
      } catch (error) {
        console.error(error)
        setIsReady(false)
        setIsLoading(false)
      }
    }

    init()
  }, [])

  return { isReady, isLoading, channel }
}
