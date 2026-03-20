import { useScanStore } from '../../store/scan-store'
import { formatBytesShort } from '../../lib/format'
import { Trash2, Zap } from 'lucide-react'

export default function CacheManagement() {
  const { games, scannedAt, setView } = useScanStore()

  const totalIndexed = games.reduce((sum, g) => sum + g.sizeBytes, 0)

  const handleClearCache = async () => {
    await window.api.clearCache()
  }

  return (
    <div className="card-cyber-accent">
      <h3 className="text-mono text-sm font-bold text-text mb-1">Cache Management</h3>
      <p className="text-[0.6rem] text-text-muted mb-4">Metadata, cover art, and local scan results.</p>

      <div className="flex flex-col items-center py-4">
        <div className="text-mono text-4xl font-bold text-accent">
          {formatBytesShort(totalIndexed)}
        </div>
        <div className="text-label mt-1">Total Indexed Size</div>
      </div>

      <div className="space-y-2 mt-4">
        <button
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-muted text-mono text-xs uppercase tracking-wider hover:border-red hover:text-red transition-all"
        >
          <Trash2 size={14} />
          Clear Metadata Cache
        </button>
        <button
          onClick={() => setView('scan')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-bg text-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-light transition-all"
        >
          <Zap size={14} />
          Optimize Database
        </button>
      </div>
    </div>
  )
}
