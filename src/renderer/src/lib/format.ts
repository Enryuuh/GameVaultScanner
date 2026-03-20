export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const value = bytes / Math.pow(1024, i)
  return `${value.toFixed(i >= 3 ? 1 : 0)} ${units[i]}`
}

export function formatBytesShort(bytes: number): string {
  if (bytes === 0) return '0'
  const gb = bytes / (1024 * 1024 * 1024)
  if (gb >= 1000) return `${(gb / 1024).toFixed(1)} TB`
  if (gb >= 1) return `${gb.toFixed(1)} GB`
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(0)} MB`
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function percentUsed(used: number, total: number): number {
  if (total === 0) return 0
  return Math.round((used / total) * 100)
}
