import { Search, Filter } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import type { Platform } from '../../store/scan-store'

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'steam', label: 'Steam' },
  { value: 'epic', label: 'Epic Games' },
  { value: 'battlenet', label: 'Battle.net' },
  { value: 'gog', label: 'GOG' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'ubisoft', label: 'Ubisoft' },
  { value: 'ea', label: 'EA' },
  { value: 'emulator', label: 'Emuladores' },
  { value: 'other', label: 'Otros' }
]

export default function GameFilters() {
  const { filters, setFilter, disks, games } = useScanStore()
  const filteredCount = useScanStore.getState().filteredGames().length

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar juego..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value)}
          className="w-full bg-card border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50"
        />
      </div>

      {/* Drive filter */}
      <div className="relative">
        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
        <select
          value={filters.drive || ''}
          onChange={(e) => setFilter('drive', e.target.value || null)}
          className="bg-card border border-border rounded-lg pl-9 pr-8 py-2 text-sm text-text appearance-none cursor-pointer focus:outline-none focus:border-accent/50"
        >
          <option value="">Todos los discos</option>
          {disks.map((d) => (
            <option key={d.drive} value={d.drive}>
              {d.drive} {d.label ? `(${d.label})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Platform filter */}
      <select
        value={filters.platform || ''}
        onChange={(e) => setFilter('platform', (e.target.value as Platform) || null)}
        className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-text appearance-none cursor-pointer focus:outline-none focus:border-accent/50"
      >
        <option value="">Todas las plataformas</option>
        {PLATFORMS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <span className="text-xs text-text-muted">
        {filteredCount} de {games.length} juegos
      </span>
    </div>
  )
}
