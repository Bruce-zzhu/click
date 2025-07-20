import { useStreamChatContext } from '@app/integrations/stream-chat/ChatWrapper';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useRef } from 'react';

const DISCONNECT_TIMEOUT = 5 * 60 * 1000 // 5 minutes

export const useConnectionTimeout = () => {
  const focused = useIsFocused()
  const { connectStreamUser, chatContext } = useStreamChatContext()
  const { client } = chatContext

  const disconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Disconnect user if they leave this screen for 5 minutes
  useEffect(() => {

    const clearTimer = () => {
      if (disconnectTimer.current) {
        clearTimeout(disconnectTimer.current)
        disconnectTimer.current = null
      }
    }

    if (focused) {
      // Screen is active → ensure connected & cancel any pending disconnect
      clearTimer()
      if (!client.userID) {
        // Reconnect only if not already connected
        connectStreamUser().catch(console.error)
      }
    } else {
      // Screen lost focus → start 5-minute countdown to disconnect
      if (!disconnectTimer.current) {
        disconnectTimer.current = setTimeout(async () => {
          if (client.userID) {
            try {
              await client.disconnectUser()
              console.log('Disconnected Stream user')
            } catch (err) {
              console.error('Failed to disconnect Stream user', err)
            }
          }
        }, DISCONNECT_TIMEOUT)
      }
    }

    // Cleanup when component unmounts
    return () => clearTimer()
  }, [focused, connectStreamUser])
}
