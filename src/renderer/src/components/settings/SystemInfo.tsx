import { Shield, Terminal } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import { formatRelativeTime } from '../../lib/format'
import StatusBadge from '../ui/StatusBadge'

export default function SystemInfo() {
  const { scannedAt } = useScanStore()

  return (
    <div className="card-cyber-accent">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={16} className="text-green" />
        <h3 className="text-mono text-sm font-bold text-text">System Integrity</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <span className="text-mono text-[0.65rem] text-text-muted">App Version</span>
          <span className="badge badge-ready">v1.0.0-stable</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <span className="text-mono text-[0.65rem] text-text-muted">Last Update</span>
          <span className="text-mono text-[0.65rem] text-text-secondary">
            {scannedAt ? formatRelativeTime(scannedAt) : 'Never'}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border/50">
          <span className="text-mono text-[0.65rem] text-text-muted">Auto-Updates</span>
          <StatusBadge variant="optimized" label="Enabled" />
        </div>
      </div>

      {/* Developer Console */}
      <button className="w-full mt-4 flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-card-hover transition-colors">
        <Terminal size={16} className="text-text-muted" />
        <div className="text-left">
          <div className="text-mono text-xs text-text-secondary">Developer Console</div>
          <div className="text-[0.55rem] text-text-muted">Access raw scan logs</div>
        </div>
      </button>
    </div>
  )
}
