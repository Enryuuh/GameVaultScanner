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

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const h = d.getHours().toString().padStart(2, '0')
  const m = d.getMinutes().toString().padStart(2, '0')
  const s = d.getSeconds().toString().padStart(2, '0')
  return `[${h}:${m}:${s}]`
}

export function formatRelativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  return `${Math.floor(diff / 86400)} days ago`
}

export function exportGamesCSV(games: { name: string; platform: string; drive: string; path: string; sizeBytes: number }[]): string {
  const header = 'Name,Platform,Drive,Path,Size (GB)'
  const rows = games.map((g) =>
    `"${g.name.replace(/"/g, '""')}","${g.platform}","${g.drive}","${g.path.replace(/"/g, '""')}",${(g.sizeBytes / (1024 ** 3)).toFixed(2)}`
  )
  return [header, ...rows].join('\n')
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
