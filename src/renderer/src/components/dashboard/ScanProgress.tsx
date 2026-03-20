import { Loader2 } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'

export default function ScanProgress() {
  const { scanning, progress } = useScanStore()

  if (!scanning || !progress) return null

  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="bg-card rounded-xl p-4 border border-accent/30">
      <div className="flex items-center gap-3 mb-3">
        <Loader2 size={18} className="text-accent animate-spin" />
        <span className="text-sm font-medium text-text">{progress.phase}</span>
        <span className="ml-auto text-xs text-text-muted">{pct}%</span>
      </div>
      <div className="h-2 bg-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      {progress.detail && (
        <p className="mt-2 text-xs text-text-muted">{progress.detail}</p>
      )}
    </div>
  )
}
