import { useState } from 'react'
import { exercises } from './lib/exercises'
import { Icon } from './components/Icon'
import './App.css'

const sections = [
  { id: 'all', label: 'Все задания', icon: 'grid', count: 10 },
  { id: 'browser', label: 'Состояние и браузер', icon: 'window', count: 5 },
  { id: 'data', label: 'Запросы и данные', icon: 'database', count: 4 },
  { id: 'subscriptions', label: 'Подписки', icon: 'message', count: 1 },
] as const

export default function App() {
  const [section, setSection] = useState('all')
  const [mounted, setMounted] = useState(true)
  const visible = exercises.filter((exercise) => section === 'all' || exercise.category === section)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={() => setSection('all')}>
          <span className="brand-mark"><Icon name="layers" /></span>
          effect<span className="brand-light">lab</span><span className="brand-dot">.</span>
        </a>
        <div className="workspace-label">УЧЕБНОЕ ПРОСТРАНСТВО</div>
        <nav aria-label="Категории заданий">
          {sections.map((item) => (
            <button key={item.id} className={`nav-item ${section === item.id ? 'active' : ''}`} onClick={() => setSection(item.id)} aria-label={item.label} aria-current={section === item.id ? 'page' : undefined}>
              <Icon name={item.icon} /><span>{item.label}</span><span className="nav-count">{item.count}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-icon"><Icon name="sparkles" /></span>
          <strong>Учимся на практике</strong>
          <p>Меняй значения и наблюдай,<br />как работают эффекты.</p>
          <div className="note-tags"><span>React</span><span>TypeScript</span></div>
        </div>
        <div className="sidebar-bottom"><span className="avatar">С</span><div><strong>Студент</strong><span>Практика React</span></div><Icon name="code" /></div>
      </aside>
      <div className="main-shell">
        <header className="topbar"><div>Практикум <span>/</span> <strong>Хук useEffect</strong></div><span className="course-badge"><span className="dot" /> Интерактивные примеры</span></header>
        <main>
          <div className="page-heading">
            <div><div className="eyebrow">REACT · ПРАКТИЧЕСКАЯ РАБОТА</div><h1>Разбираемся с <span>useEffect</span></h1><p>10 небольших заданий. От первого эффекта до собственного хука.</p></div>
            <span className="lesson-symbol" aria-hidden="true"><Icon name="code" /></span>
          </div>
          <div className="overview">
            <div><span className="overview-icon purple"><Icon name="grid" /></span><span><strong>10 заданий</strong><small>Всё в одном месте</small></span></div>
            <div><span className="overview-icon blue"><Icon name="bolt" /></span><span><strong>Живые примеры</strong><small>Попробуй прямо здесь</small></span></div>
            <div><span className="overview-icon green"><Icon name="check" /></span><span><strong>С очисткой эффектов</strong><small>Таймеры, запросы и подписки</small></span></div>
          </div>
          <div className="section-heading"><h2>{sections.find((item) => item.id === section)?.label} <span>{visible.length}</span></h2><button className="text-button" onClick={() => setMounted((value) => !value)}><Icon name={mounted ? 'eye-off' : 'eye'} />{mounted ? 'Скрыть примеры' : 'Показать примеры'}</button></div>
          {mounted ? <div className="exercise-grid">{visible.map(({ id, title, description, tag, Component, icon }) => (
            <section className="exercise-card" key={id} aria-labelledby={`task-${id}`}>
              <div className="card-heading"><span className="task-number">{String(id).padStart(2, '0')}</span><span className="effect-tag">{tag}</span><Icon name={icon} /></div>
              <h3 id={`task-${id}`}>{title}</h3><p className="card-description">{description}</p>
              <Component />
            </section>
          ))}</div> : <div className="empty-state"><Icon name="eye-off" /><h3>Компоненты удалены со страницы</h3><p>Обработчики, таймеры и запросы очищены. Исходный заголовок вкладки восстановлен.</p><button className="button primary" onClick={() => setMounted(true)}>Показать примеры</button></div>}
          <footer className="page-footer"><span><Icon name="code" /> Создано для практики, понятно по коду.</span><span>useEffect · зависимости · cleanup</span></footer>
        </main>
      </div>
    </div>
  )
}
