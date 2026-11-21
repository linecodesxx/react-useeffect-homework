import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const users = [
  { id: 1, name: 'Алексей Смирнов', email: 'alexey@example.com', role: 'Разработчик', city: 'Самара', color: 'purple' },
  { id: 2, name: 'Мария Иванова', email: 'maria@example.com', role: 'Дизайнер', city: 'Москва', color: 'peach' },
  { id: 3, name: 'Даниил Козлов', email: 'daniil@example.com', role: 'Разработчик', city: 'Казань', color: 'blue' },
  { id: 4, name: 'Анна Петрова', email: 'anna@example.com', role: 'Аналитик', city: 'Санкт-Петербург', color: 'green' },
]
const materials = [
  { id: 1, title: 'React: с чего начать', description: 'Компоненты, JSX и первые шаги в React.' },
  { id: 2, title: 'Как работает useEffect', description: 'Эффекты, массив зависимостей и жизненный цикл.' },
  { id: 3, title: 'Состояние с useState', description: 'Ленивая инициализация и функциональное обновление.' },
  { id: 4, title: 'Очистка эффектов: cleanup', description: 'Удаление подписок, остановка таймеров и отмена запросов.' },
  { id: 5, title: 'Запросы с AbortController', description: 'Fetch API и защита от устаревших ответов.' },
  { id: 6, title: 'Собственные хуки React', description: 'Выносим повторяющуюся логику в custom hooks.' },
  { id: 7, title: 'Debounce и поиск', description: 'Как отправлять запрос после паузы во вводе.' },
]

// Настоящие HTTP-эндпоинты для учебных примеров, доступны в dev и preview.
function middleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url ?? '/', 'http://localhost')
  if (!url.pathname.startsWith('/api/')) { next(); return }
  if (req.method !== 'GET') { res.writeHead(405).end(); return }
  let code = 200
  let body: unknown
  if (url.searchParams.get('fail') === 'true') {
    code = 503
    body = { error: 'Учебная ошибка: сервис временно недоступен' }
  } else if (url.pathname === '/api/users') {
    body = users
  } else if (/^\/api\/users\/\d+$/.test(url.pathname)) {
    body = users.find((user) => user.id === Number(url.pathname.split('/').pop()))
    if (!body) { code = 404; body = { error: 'Пользователь не найден' } }
  } else if (url.pathname === '/api/search') {
    const query = (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase('ru-RU')
    body = query ? materials.filter((item) => `${item.title} ${item.description}`.toLocaleLowerCase('ru-RU').includes(query)) : []
  } else if (url.pathname === '/api/status') {
    body = { status: 'Все системы работают', updatedAt: new Date().toISOString(), latency: 24 + Math.floor(Math.random() * 25) }
  } else {
    code = 404
    body = { error: 'Эндпоинт не найден' }
  }
  // Разная задержка помогает проверить гонку при быстром выборе пользователя.
  const delay = url.pathname.startsWith('/api/users/') ? (Number(url.pathname.split('/').pop()) % 2 ? 900 : 300) : 450
  const timer = setTimeout(() => {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(body))
  }, delay)
  res.on('close', () => clearTimeout(timer))
}

export function demoApi(): Plugin {
  return {
    name: 'effectlab-demo-api',
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { server.middlewares.use(middleware) },
  }
}
