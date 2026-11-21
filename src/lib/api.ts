export type User = { id: number; name: string; email: string; role: string; city: string; color: string }
export type ServiceStatus = { status: string; updatedAt: string; latency: number }

export async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`)
  return response.json() as Promise<T>
}
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Не удалось загрузить данные'
}
