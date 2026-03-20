import { useScanStore } from '../../store/scan-store'
import StatsRow from './StatsRow'
import KineticStorageMap from './KineticStorageMap'
import RecentActivity from './RecentActivity'
import VaultHealthMetrics from './VaultHealthMetrics'
import { Zap, Trash2, Radar } from 'lucide-react'

export default function DashboardView() {
  const { scannedAt, scanning, setView } = useScanStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <StatsRow />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <KineticStorageMap />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <VaultHealthMetrics />
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setView('scan')}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-bg text-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-light transition-all glow-cyan"
          >
            <Zap size={16} />
            Scan Now
          </button>
          <button
            onClick={async () => {
              await window.api.clearCache()
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-muted text-mono text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
          >
            <Trash2 size={14} />
            Wipe Cache
          </button>
          <button
            onClick={() => setView('scan')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-muted text-mono text-xs uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
          >
            <Radar size={14} />
            Quick Scan
          </button>
        </div>
      </div>

      {!scannedAt && !scanning && (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-4">
          <Radar size={48} className="text-accent/20" />
          <p className="text-mono text-sm text-text-secondary">No scan data available</p>
          <p className="text-xs text-center max-w-md text-text-muted">
            Navigate to the Scan tab to initiate a full system scan and detect all installed games.
          </p>
        </div>
      )}
    </div>
  )
}
