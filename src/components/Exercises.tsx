/* oxlint-disable react/set-state-in-effect -- В учебных эффектах явно показываем сброс состояния загрузки и синхронизацию с хранилищем. */
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { getJson, errorMessage } from '../lib/api'
import type { User, ServiceStatus } from '../lib/api'
import { useChatRoom } from '../hooks/useChatRoom'
import { Icon } from './Icon'

function Footnote({ children }: { children: ReactNode }) {
  return <div className="card-footnote"><Icon name="code" /><span>{children}</span></div>
}
function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: ReactNode }) {
  return <label className="toggle-label"><input type="checkbox" role="switch" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span className="toggle-track" />{children}</label>
}
function Loading() { return <div className="feedback" role="status"><span className="spinner" />Загружаем данные…</div> }
function ErrorNotice({ message }: { message: string }) { return <div className="error-notice" role="alert"><Icon name="info" />{message}</div> }

// 1. Захватываем исходный title при монтировании и возвращаем его в cleanup.
export function TitleCounter() {
  const [count, setCount] = useState(5)
  useEffect(() => {
    const originalTitle = document.title
    return () => { document.title = originalTitle }
  }, [])
  useEffect(() => { document.title = `Счётчик: ${count}` }, [count])
  return <><div className="demo counter-demo"><button className="counter-button" onClick={() => setCount((value) => value - 1)} aria-label="Уменьшить счётчик">−</button><output className="counter-value">{count}</output><button className="counter-button" onClick={() => setCount((value) => value + 1)} aria-label="Увеличить счётчик">+</button></div><div className="inline-hint"><span className="dot" /> Посмотри на заголовок вкладки</div><Footnote>document.title <span className="code-separator">·</span> [count] + cleanup</Footnote></>
}

// 2. Функция в useState читает хранилище только при создании состояния.
export function SavedName() {
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('effectlab-name') ?? '' } catch { return '' }
  })
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    try { localStorage.setItem('effectlab-name', name); setSaved(true) } catch { setSaved(false) }
  }, [name])
  return <><div className="demo name-demo"><label htmlFor="saved-name">Как тебя зовут?</label><input id="saved-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Введи своё имя" autoComplete="given-name" /><div className="name-greeting">{name.trim() ? <>Привет, <strong>{name.trim()}</strong> <span aria-hidden="true">✦</span></> : 'Знакомство начинается с имени'}</div></div><div className={`inline-hint ${saved ? 'success' : ''}`}><Icon name={saved ? 'check' : 'info'} />{saved ? 'Сохранено · имя останется после перезагрузки' : 'Хранилище браузера недоступно'}</div><Footnote>localStorage <span className="code-separator">·</span> [name]</Footnote></>
}

// 3. В removeEventListener передаём ту же функцию, что и в addEventListener.
export function WindowSize() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return <><div className="demo dimensions-demo"><div><span>ШИРИНА</span><output>{size.width}<small>px</small></output></div><span className="dimension-cross">×</span><div><span>ВЫСОТА</span><output>{size.height}<small>px</small></output></div><span className="screen-illustration"><Icon name="window" /></span></div><div className="inline-hint">Измени размер окна — значения обновятся</div><Footnote>resize <span className="code-separator">·</span> [] + removeEventListener</Footnote></>
}

// 4. Функциональное обновление не замыкает старое значение seconds.
export function Stopwatch() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(interval)
  }, [running])
  const formatted = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map((value) => String(value).padStart(2, '0'))
  return <><div className="demo stopwatch-demo"><output className={`timer-value ${running ? 'running' : ''}`}>{formatted[0]}<span>:</span>{formatted[1]}<span>:</span>{formatted[2]}</output><div className="button-row"><button className="button primary" disabled={running} onClick={() => setRunning(true)}><Icon name="play" />Старт</button><button className="button" disabled={!running} onClick={() => setRunning(false)}><Icon name="pause" />Пауза</button><button className="button icon-button" aria-label="Сброс" title="Сброс" onClick={() => { setRunning(false); setSeconds(0) }}><Icon name="reset" /></button></div></div><Footnote>setInterval <span className="code-separator">·</span> [running] + clearInterval</Footnote></>
}

// 5. При изменении enabled React сначала вызовет cleanup старого эффекта.
export function MouseTracker() {
  const [enabled, setEnabled] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  useEffect(() => {
    if (!enabled) return
    const onMove = (event: MouseEvent) => setPosition({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled])
  return <><div className="demo mouse-demo"><div className="demo-toolbar"><Toggle checked={enabled} onChange={setEnabled}>Отслеживать</Toggle><span className={`small-status ${enabled ? 'success' : ''}`}><span className="dot" />{enabled ? 'Активно' : 'Выключено'}</span></div><div className={`coordinate-area ${enabled ? 'tracking' : ''}`}><Icon name="cursor" /><div><span>X <output>{position?.x ?? '—'}</output></span><span>Y <output>{position?.y ?? '—'}</output></span></div><small>{enabled ? 'Двигай мышью в любой части окна' : 'Включи переключатель, чтобы начать'}</small></div></div><Footnote>mousemove <span className="code-separator">·</span> [enabled] + cleanup</Footnote></>
}

// 6. signal.aborted также защищает от обновления состояния после cleanup.
export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [simulateError, setSimulateError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getJson<User[]>(`/api/users${simulateError ? '?fail=true' : ''}`, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setUsers(data) })
      .catch((reason: unknown) => { if (!controller.signal.aborted) setError(errorMessage(reason)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [attempt, simulateError])
  return <><div className="demo users-demo"><div className="demo-toolbar"><span className="endpoint">GET /api/users</span><button className="text-button" onClick={() => { setSimulateError(false); setAttempt((value) => value + 1) }} aria-label="Загрузить пользователей повторно"><Icon name="refresh" />Обновить</button></div>{loading ? <Loading /> : error ? <ErrorNotice message={error} /> : <ul className="user-list">{users.map((user) => <li key={user.id}><span className={`user-avatar ${user.color}`}>{user.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{user.name}</strong><small>{user.email}</small></div><span className="user-role">{user.role}</span></li>)}</ul>}</div><div className="inline-hint spread"><span><span className={`dot ${error ? 'error-dot' : ''}`} />{loading ? 'Запрос выполняется' : error ? 'Ошибка загрузки' : `Загружено: ${users.length} пользователя`}</span><button className="subtle-button" onClick={() => setSimulateError((value) => !value)}>{simulateError ? 'Убрать ошибку' : 'Проверить ошибку'}</button></div><Footnote>fetch + AbortController <span className="code-separator">·</span> cleanup</Footnote></>
}

// 7. Старый запрос отменяется; даже уже полученный ответ проверяет signal.
export function UserProfile() {
  const [userId, setUserId] = useState('1')
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    setUser(null)
    getJson<User>(`/api/users/${userId}`, controller.signal)
      .then((data) => { if (!controller.signal.aborted) setUser(data) })
      .catch((reason: unknown) => { if (!controller.signal.aborted) setError(errorMessage(reason)) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [userId])
  return <><div className="demo profile-demo"><label htmlFor="user-select">Выбери пользователя</label><select id="user-select" value={userId} onChange={(event) => setUserId(event.target.value)}><option value="1">Алексей Смирнов</option><option value="2">Мария Иванова</option><option value="3">Даниил Козлов</option><option value="4">Анна Петрова</option></select>{loading ? <Loading /> : error ? <ErrorNotice message={error} /> : user && <div className="profile"><span className={`user-avatar large ${user.color}`}>{user.name.split(' ').map((part) => part[0]).join('')}</span><div><strong>{user.name}</strong><small>{user.role} · {user.city}</small><a href={`mailto:${user.email}`}>{user.email}</a></div><span className="profile-id">#{user.id}</span></div>}</div><div className="inline-hint"><Icon name="check" /> При быстром выборе остаётся только актуальный ответ</div><Footnote>AbortController <span className="code-separator">·</span> [userId]</Footnote></>
}

type SearchResult = { id: number; title: string; description: string }
// 8. Один cleanup отменяет и отложенный запуск, и выполняющийся запрос.
export function DebouncedSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [state, setState] = useState<'idle' | 'waiting' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  useEffect(() => {
    const term = query.trim()
    setResults([])
    setError('')
    if (!term) { setState('idle'); return }
    const controller = new AbortController()
    setState('waiting')
    const timeout = setTimeout(() => {
      setState('loading')
      getJson<SearchResult[]>(`/api/search?q=${encodeURIComponent(term)}`, controller.signal)
        .then((data) => { if (!controller.signal.aborted) { setResults(data); setState('success') } })
        .catch((reason: unknown) => { if (!controller.signal.aborted) { setError(errorMessage(reason)); setState('error') } })
    }, 500)
    return () => { clearTimeout(timeout); controller.abort() }
  }, [query])
  return <><div className="demo search-demo"><label htmlFor="search">Поиск по материалам</label><div className="search-input"><Icon name="search" /><input id="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Например, React или useEffect" />{query && <button aria-label="Очистить поиск" onClick={() => setQuery('')}>×</button>}</div><div className="search-results" aria-live="polite">{state === 'idle' ? <div className="search-placeholder"><Icon name="search" /><span>Начни вводить, а мы найдём нужное</span></div> : state === 'waiting' ? <div className="feedback">Ждём окончания ввода…</div> : state === 'loading' ? <Loading /> : state === 'error' ? <ErrorNotice message={error} /> : results.length ? <ul>{results.map((result) => <li key={result.id}><strong>{result.title}</strong><small>{result.description}</small></li>)}</ul> : <div className="feedback">Ничего не найдено. Попробуй «React».</div>}</div></div><div className="inline-hint"><span className="delay-tag">500 мс</span> Запрос только после паузы во вводе</div><Footnote>setTimeout + abort <span className="code-separator">·</span> [query]</Footnote></>
}

// 9. inFlight принадлежит одному эффекту: медленный запрос не перекрывается новым.
export function StatusPolling() {
  const [automatic, setAutomatic] = useState(true)
  const [data, setData] = useState<ServiceStatus | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!automatic) { setLoading(false); return }
    let inFlight = false
    let active = true
    let controller: AbortController | undefined
    const load = async () => {
      if (inFlight) return
      inFlight = true
      controller = new AbortController()
      setLoading(true)
      setError('')
      try {
        const result = await getJson<ServiceStatus>('/api/status', controller.signal)
        if (active) setData(result)
      } catch (reason) {
        if (active && !controller.signal.aborted) setError(errorMessage(reason))
      } finally {
        inFlight = false
        if (active) setLoading(false)
      }
    }
    void load()
    const interval = setInterval(() => { void load() }, 10_000)
    return () => { active = false; clearInterval(interval); controller?.abort() }
  }, [automatic])
  return <><div className="demo polling-demo"><div className="demo-toolbar"><Toggle checked={automatic} onChange={setAutomatic}>Автообновление</Toggle><span className="delay-tag">10 сек</span></div>{error ? <ErrorNotice message={error} /> : <div className="server-status"><span className={`server-status-icon ${!data ? 'pending' : ''}`}><Icon name={data ? 'check' : 'refresh'} /></span><div><strong>{data?.status ?? (automatic ? 'Проверяем доступность…' : 'Обновление приостановлено')}</strong><small>{data ? `Время ответа: ${data.latency} мс` : 'Локальный учебный API'}</small></div>{loading && <span className="spinner" />}</div>}<div className="status-bottom"><span className="small-status"><span className={`dot ${automatic ? '' : 'gray-dot'}`} />{automatic ? 'Обновляется автоматически' : 'Обновление на паузе'}</span><time>{data ? new Date(data.updatedAt).toLocaleTimeString('ru-RU') : '—'}</time></div></div><Footnote>setInterval + abort <span className="code-separator">·</span> [automatic]</Footnote></>
}

export function ChatRoom() {
  const [roomId, setRoomId] = useState('general')
  const { messages, status } = useChatRoom(roomId)
  return <><div className="demo chat-demo"><div className="demo-toolbar"><label className="sr-only" htmlFor="room">Комната чата</label><select id="room" value={roomId} onChange={(event) => setRoomId(event.target.value)}><option value="general"># general</option><option value="react"># react</option><option value="homework"># homework</option></select><span className={`small-status ${status === 'connected' ? 'success' : ''}`}><span className="dot" />{status === 'connected' ? 'Подключено' : status === 'connecting' ? 'Подключение…' : 'Отключено'}</span></div><div className="chat-messages" role="log" aria-label="Сообщения комнаты">{messages.length ? messages.map((message) => <div className="chat-message" key={message.id}><span className={`user-avatar ${message.author === 'Мария' ? 'peach' : 'purple'}`}>{message.author[0]}</span><div><strong>{message.author}<time>{message.time}</time></strong><p>{message.text}</p></div></div>) : <div className="feedback">Подключаемся к комнате…</div>}</div></div><div className="inline-hint">Демо-сообщения приходят каждые 7 секунд</div><Footnote>useChatRoom(roomId) <span className="code-separator">·</span> off + disconnect</Footnote></>
}

