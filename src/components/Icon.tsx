const paths: Record<string, string> = {
  grid: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  window: 'M3 4h18v16H3z M3 9h18 M7 6.5h.01 M10 6.5h.01',
  database: 'M20 6c0 2.2-16 2.2-16 0s16-2.2 16 0v12c0 2.7-16 2.7-16 0V6 M4 12c0 2.7 16 2.7 16 0',
  message: 'M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2v-10a9 9 0 0 1 19-.5Z M7 10h10 M7 14h6',
  layers: 'm12 3 10 5-10 5L2 8z M2 12l10 5 10-5 M2 16l10 5 10-5',
  sparkles: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z M20 2v4 M18 4h4',
  code: 'm8 7-5 5 5 5 M16 7l5 5-5 5 M14 4l-4 16',
  bolt: 'm13 2-9 12h7l-1 8 10-13h-8z',
  check: 'm5 12 4 4L19 6',
  'eye-off': 'm3 3 18 18 M10.6 10.6a2 2 0 0 0 2.8 2.8 M9 4.5A12 12 0 0 1 22 12a15 15 0 0 1-3 3.8 M6 6C4 7.4 2.6 9.4 2 12c2 5 7 8 12 7.5',
  eye: 'M2 12c4-10 16-10 20 0-4 10-16 10-20 0Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  title: 'M4 5h16 M12 5v15 M8 20h8',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2',
  expand: 'M9 3H3v6 M15 3h6v6 M3 15v6h6 M21 15v6h-6',
  timer: 'M9 2h6 M12 5v2 M18 7l2-2 M20 14a8 8 0 1 1-16 0 8 8 0 0 1 16 0 M12 10v5l3 2',
  cursor: 'm4 3 7 18 3-7 7-3z',
  users: 'M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M2 21v-2a8 8 0 0 1 16 0v2 M17 3a4 4 0 0 1 0 8 M21 21v-2a8 8 0 0 0-3-6',
  search: 'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0 m-2 5 7 7',
  refresh: 'M20 7v5h-5 M4 17v-5h5 M5 7a8 8 0 0 1 14-1l1 2 M4 16l1 2a8 8 0 0 0 14-1',
  play: 'm8 5 11 7-11 7z',
  pause: 'M8 5v14 M16 5v14',
  reset: 'M3 9V3 M3 9h6 M3 9a9 9 0 1 1 0 6',
  arrow: 'M5 12h14 m-5-5 5 5-5 5',
  info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
}
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.code} /></svg>
}
