import type { DetectedGame } from '../../store/scan-store'
import { formatBytesShort, formatDate } from '../../lib/format'
import PlatformBadge from './PlatformBadge'
import { MoreVertical, FolderOpen } from 'lucide-react'
import { useState } from 'react'

interface GameTableProps {
  games: DetectedGame[]
  startIndex: number
}

export default function GameTable({ games, startIndex }: GameTableProps) {
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-2">
        <p className="text-mono text-xs">No entities match current filters</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_160px_80px_100px_40px] gap-2 px-3 py-2 border-b border-border">
        <span className="text-label">Game Title</span>
        <span className="text-label">Platform</span>
        <span className="text-label">Drive Location</span>
        <span className="text-label text-right">Size</span>
        <span className="text-label text-right">Installed</span>
        <span className="text-label text-center">Actions</span>
      </div>

      {/* Rows */}
      {games.map((game, i) => (
        <div
          key={`${game.platform}-${game.path}`}
          className="grid grid-cols-[1fr_100px_160px_80px_100px_40px] gap-2 px-3 py-2.5 border-b border-border/50 hover:bg-card-hover transition-colors items-center"
        >
          {/* Game Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-card flex items-center justify-center flex-shrink-0 text-mono text-xs text-accent font-bold">
              {(startIndex + i + 1).toString().padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-text truncate">{game.name}</div>
              <span className="badge badge-optimized text-[0.5rem]">
                {game.sizeBytes > 50 * 1024 ** 3 ? 'OPTIMIZED' : game.sizeBytes > 10 * 1024 ** 3 ? 'READY' : 'INDEXED'}
              </span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <PlatformBadge platform={game.platform} />
          </div>

          {/* Drive Location */}
          <div className="text-mono text-[0.65rem] text-text-muted truncate" title={game.path}>
            {game.path.length > 30 ? game.drive + '\\...' + game.path.slice(-20) : game.path}
          </div>

          {/* Size */}
          <div className="text-mono text-sm font-bold text-accent text-right">
            {formatBytesShort(game.sizeBytes)}
          </div>

          {/* Installed */}
          <div className="text-mono text-[0.65rem] text-text-muted text-right">
            {game.lastPlayed ? formatDate(game.lastPlayed) : '--'}
          </div>

          {/* Actions */}
          <div className="relative flex justify-center">
            <button
              onClick={() => setMenuOpen(menuOpen === i ? null : i)}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-card transition-colors"
            >
              <MoreVertical size={14} className="text-text-muted" />
            </button>
            {menuOpen === i && (
              <div className="absolute right-0 top-7 z-10 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                <button
                  onClick={() => {
                    window.api.openPath(game.path)
                    setMenuOpen(null)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-text-secondary hover:bg-card-hover transition-colors"
                >
                  <FolderOpen size={12} />
                  Open Folder
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
