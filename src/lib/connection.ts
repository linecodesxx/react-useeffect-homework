export type ChatMessage = { id: string; author: string; text: string; time: string }
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'
type Event = 'connect' | 'disconnect' | 'message'
type Listener = (message?: ChatMessage) => void

// Учебное соединение: имитирует сервер без внешних сервисов.
export function createConnection(roomId: string) {
  const listeners = new Map<Event, Set<Listener>>()
  let connectTimer: ReturnType<typeof setTimeout> | undefined
  let messageTimer: ReturnType<typeof setInterval> | undefined
  let sequence = 0
  const emit = (event: Event, message?: ChatMessage) => listeners.get(event)?.forEach((listener) => listener(message))
  const emitMessage = () => {
    const texts = roomId === 'react' ? ['Привет! Здесь обсуждаем React 👋', 'Не забывай про массив зависимостей.', 'У каждого эффекта есть свой жизненный цикл.'] : roomId === 'homework' ? ['Добро пожаловать в комнату домашних заданий!', 'Все десять заданий можно проверить на этой странице.', 'Очистка эффекта — тоже часть решения.'] : ['Привет! Рады видеть тебя в общем чате 👋', 'Как проходит практика?', 'Попробуй переключить комнату.']
    emit('message', { id: `${roomId}-${sequence}`, author: sequence % 2 === 0 ? 'Алексей' : 'Мария', text: texts[sequence % texts.length]!, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) })
    sequence += 1
  }
  return {
    connect() {
      clearTimeout(connectTimer)
      clearInterval(messageTimer)
      connectTimer = setTimeout(() => {
        emit('connect')
        emitMessage()
        messageTimer = setInterval(emitMessage, 7000)
      }, 650)
    },
    disconnect() {
      clearTimeout(connectTimer)
      clearInterval(messageTimer)
      emit('disconnect')
    },
    on(event: Event, listener: Listener) {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)!.add(listener)
    },
    off(event: Event, listener: Listener) { listeners.get(event)?.delete(listener) },
  }
}
