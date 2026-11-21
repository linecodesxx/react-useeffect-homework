import { TitleCounter, SavedName, WindowSize, Stopwatch, MouseTracker, UsersList, UserProfile, DebouncedSearch, StatusPolling, ChatRoom } from '../components/Exercises'

export const exercises = [
  { id: 1, category: 'browser', title: 'Заголовок вкладки', description: 'Изменяй счётчик — заголовок вкладки изменится вместе с ним.', tag: 'Побочный эффект', icon: 'title', Component: TitleCounter },
  { id: 2, category: 'browser', title: 'Запомним твоё имя', description: 'Введи имя. Оно сохранится даже после перезагрузки страницы.', tag: 'Local Storage', icon: 'user', Component: SavedName },
  { id: 3, category: 'browser', title: 'Размер окна', description: 'Текущие размеры окна браузера, без перезагрузки страницы.', tag: 'События', icon: 'expand', Component: WindowSize },
  { id: 4, category: 'browser', title: 'Секундомер', description: 'Запускай, приостанавливай и начинай отсчёт заново.', tag: 'Таймеры', icon: 'timer', Component: Stopwatch },
  { id: 5, category: 'browser', title: 'Следим за курсором', description: 'Координаты мыши и подписка, которой можно управлять.', tag: 'Условный эффект', icon: 'cursor', Component: MouseTracker },
  { id: 6, category: 'data', title: 'Загрузка пользователей', description: 'Запрос к API с состояниями загрузки, успеха и ошибки.', tag: 'Fetch API', icon: 'users', Component: UsersList },
  { id: 7, category: 'data', title: 'Карточка пользователя', description: 'Выбирай пользователя. Старые запросы отменятся сами.', tag: 'Зависимости', icon: 'user', Component: UserProfile },
  { id: 8, category: 'data', title: 'Поиск без лишних запросов', description: 'Небольшая задержка между вводом текста и запросом к API.', tag: 'Debounce', icon: 'search', Component: DebouncedSearch },
  { id: 9, category: 'data', title: 'Всегда свежие данные', description: 'Статус сервиса с обновлением каждые 10 секунд.', tag: 'Polling', icon: 'refresh', Component: StatusPolling },
  { id: 10, category: 'subscriptions', title: 'Своя комната в чате', description: 'Собственный хук для подключения к комнате и приёма сообщений.', tag: 'Custom Hook', icon: 'message', Component: ChatRoom },
]
