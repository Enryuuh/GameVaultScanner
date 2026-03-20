import { Folder, HardDrive } from 'lucide-react'
import PlatformBadge from './PlatformBadge'
import { formatBytes } from '../../lib/format'
import type { DetectedGame } from '../../store/scan-store'

export default function GameCard({ game, index }: { game: DetectedGame; index: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-card border border-border rounded-lg hover:border-accent/30 transition-colors group">
      {/* Rank number */}
      <span className="text-sm font-mono text-text-muted w-6 text-right">
        {index + 1}
      </span>

      {/* Game info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm text-text truncate">{game.name}</span>
          <PlatformBadge platform={game.platform} />
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Folder size={11} />
            <span className="truncate max-w-[300px]">{game.path}</span>
          </span>
        </div>
      </div>

      {/* Drive */}
      <div className="flex items-center gap-1 text-xs text-text-secondary">
        <HardDrive size={12} className="text-accent" />
        {game.drive}
      </div>

      {/* Size */}
      <div className="text-right min-w-[80px]">
        <span className="text-sm font-semibold text-cyan">
          {formatBytes(game.sizeBytes)}
        </span>
      </div>
    </div>
  )
}
