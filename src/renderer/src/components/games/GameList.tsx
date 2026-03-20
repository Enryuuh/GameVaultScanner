import { useMemo } from 'react'
import { Gamepad2, HardDrive, Download } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import { formatBytes } from '../../lib/format'
import GameFilters from './GameFilters'
import GameCard from './GameCard'

export default function GameList() {
  const games = useScanStore((s) => s.games)
  const scannedAt = useScanStore((s) => s.scannedAt)
  const filters = useScanStore((s) => s.filters)

  const filtered = useMemo(() => {
    return games.filter((game) => {
      if (filters.drive && game.drive !== filters.drive) return false
      if (filters.platform && game.platform !== filters.platform) return false
      if (filters.search && !game.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      return true
    })
  }, [games, filters])

  const totalSize = useMemo(() => filtered.reduce((sum, g) => sum + g.sizeBytes, 0), [filtered])

  if (!scannedAt) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-4">
        <Gamepad2 size={48} strokeWidth={1} />
        <p className="text-lg">No hay datos de escaneo</p>
        <p className="text-sm">Presiona "Escanear" para detectar tus juegos</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Stats bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Gamepad2 size={16} className="text-accent" />
          <span className="text-sm text-text-secondary">
            <strong className="text-text">{filtered.length}</strong> juegos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive size={16} className="text-cyan" />
          <span className="text-sm text-text-secondary">
            <strong className="text-cyan">{formatBytes(totalSize)}</strong> total
          </span>
        </div>
      </div>

      {/* Filters */}
      <GameFilters />

      {/* Game list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((game, i) => (
          <GameCard key={`${game.platform}-${game.path}`} game={game} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-2">
            <Download size={32} strokeWidth={1} />
            <p className="text-sm">No se encontraron juegos con estos filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}
