import { describe, expect, test } from 'bun:test'
import { EventEmitter } from 'node:events'
import { demoApi } from '../server/api'
import { createConnection } from '../src/lib/connection'
import type { ChatMessage } from '../src/lib/connection'

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Проверяем middleware без прослушивания порта и без внешних сервисов.
function request(url: string, method = 'GET') {
  return new Promise<{ code: number; body: unknown; headers: Record<string, string> }>((resolve, reject) => {
    const response = new EventEmitter() as EventEmitter & {
      writeHead: (code: number, headers?: Record<string, string>) => typeof response
      end: (body?: string) => void
    }
    let status = 200
    let headers: Record<string, string> = {}
    response.writeHead = (code, values = {}) => { status = code; headers = values; return response }
    response.end = (body) => { resolve({ code: status, body: body ? JSON.parse(body) : null, headers }); response.emit('close') }
    const setup = demoApi().configureServer as (server: unknown) => void
    setup({ middlewares: { use: (handler: (req: unknown, res: unknown, next: () => void) => void) => {
      handler({ url, method }, response, () => reject(new Error('API request was not handled')))
    } } })
  })
}

describe('Учебный API', () => {
  test('список пользователей и карточка согласованы', async () => {
    const [list, profile] = await Promise.all([request('/api/users'), request('/api/users/2')])
    expect(list.code).toBe(200)
    expect(list.body).toHaveLength(4)
    expect((list.body as { id: number }[]).find((user) => user.id === 2)).toEqual(profile.body)
    expect(list.headers['Content-Type']).toContain('application/json')
  })
  test('поиск нечувствителен к регистру и не возвращает всё для пробелов', async () => {
    const [found, empty] = await Promise.all([request('/api/search?q=REACT'), request('/api/search?q=%20%20')])
    expect((found.body as unknown[]).length).toBeGreaterThan(0)
    expect(empty.body).toEqual([])
  })
  test('отдаёт ошибки, а не HTML страницы', async () => {
    const responses = await Promise.all([request('/api/users?fail=true'), request('/api/users/99'), request('/api/unknown'), request('/api/users', 'POST')])
    expect(responses.map((response) => response.code)).toEqual([503, 404, 404, 405])
  })
  test('статус содержит корректную дату обновления', async () => {
    const response = await request('/api/status')
    const body = response.body as { status: string; updatedAt: string; latency: number }
    expect(response.code).toBe(200)
    expect(body.status).toBe('Все системы работают')
    expect(Number.isNaN(Date.parse(body.updatedAt))).toBe(false)
    expect(body.latency).toBeGreaterThan(0)
  })
})

describe('Соединение комнаты', () => {
  test('отключение отменяет ещё не завершённое подключение', async () => {
    const connection = createConnection('react')
    let connected = false
    const messages: ChatMessage[] = []
    connection.on('connect', () => { connected = true })
    connection.on('message', (message) => { if (message) messages.push(message) })
    connection.connect()
    connection.disconnect()
    await pause(700)
    expect(connected).toBe(false)
    expect(messages).toEqual([])
  })
  test('принимает сообщение комнаты и удаляет подписку', async () => {
    const connection = createConnection('react')
    const messages: ChatMessage[] = []
    let disconnected = 0
    const onMessage = (message?: ChatMessage) => { if (message) messages.push(message) }
    const onDisconnect = () => { disconnected += 1 }
    connection.on('message', onMessage)
    connection.on('disconnect', onDisconnect)
    try {
      connection.connect()
      await pause(700)
      expect(messages).toHaveLength(1)
      expect(messages[0]!.id).toStartWith('react-')
      connection.off('message', onMessage)
      connection.off('disconnect', onDisconnect)
      connection.disconnect()
      expect(disconnected).toBe(0)
      connection.connect()
      await pause(700)
      expect(messages).toHaveLength(1)
    } finally { connection.disconnect() }
  })
})
