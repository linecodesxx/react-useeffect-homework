/* oxlint-disable react/set-state-in-effect -- Новая комната начинает подключение с пустой историей сообщений. */
import { useEffect, useState } from 'react'
import { createConnection } from '../lib/connection'
import type { ChatMessage, ConnectionStatus } from '../lib/connection'

export function useChatRoom(roomId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('connecting')

  useEffect(() => {
    const connection = createConnection(roomId)
    setMessages([])
    setStatus('connecting')
    const onConnect = () => setStatus('connected')
    const onDisconnect = () => setStatus('disconnected')
    const onMessage = (message?: ChatMessage) => {
      if (message) setMessages((previous) => [...previous, message].slice(-30))
    }
    connection.on('connect', onConnect)
    connection.on('disconnect', onDisconnect)
    connection.on('message', onMessage)
    connection.connect()
    return () => {
      connection.off('connect', onConnect)
      connection.off('disconnect', onDisconnect)
      connection.off('message', onMessage)
      connection.disconnect()
    }
  }, [roomId])
  return { messages, status }
}
