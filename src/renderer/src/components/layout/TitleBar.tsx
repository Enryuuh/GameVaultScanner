import { Minus, Square, X, Bell, RefreshCw, Shield } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'

export default function TitleBar() {
  const scanning = useScanStore((s) => s.scanning)

  return (
    <div
      className="flex items-center justify-between h-10 bg-surface border-b border-border select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: Status */}
      <div className="flex items-center gap-4 pl-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-yellow animate-pulse' : 'bg-green'}`} />
          <span className="text-mono text-[0.65rem] uppercase tracking-wider text-accent">
            System Status: {scanning ? 'Scanning...' : 'Optimal'}
          </span>
        </div>
      </div>

      {/* Right: Actions + Window Controls */}
      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button className="w-9 h-10 flex items-center justify-center hover:bg-card transition-colors">
          <Bell size={13} className="text-text-muted" />
        </button>
        <button className="w-9 h-10 flex items-center justify-center hover:bg-card transition-colors">
          <RefreshCw size={13} className="text-text-muted" />
        </button>

        <div className="flex items-center gap-2 px-3 mx-2 border-l border-border">
          <span className="text-mono text-[0.6rem] uppercase tracking-wider text-text-muted">Administrator</span>
          <div className="w-6 h-6 rounded bg-card flex items-center justify-center">
            <Shield size={12} className="text-accent" />
          </div>
        </div>

        <div className="flex border-l border-border">
          <button
            onClick={() => window.api.minimizeWindow()}
            className="w-11 h-10 flex items-center justify-center hover:bg-card transition-colors"
          >
            <Minus size={14} className="text-text-muted" />
          </button>
          <button
            onClick={() => window.api.maximizeWindow()}
            className="w-11 h-10 flex items-center justify-center hover:bg-card transition-colors"
          >
            <Square size={11} className="text-text-muted" />
          </button>
          <button
            onClick={() => window.api.closeWindow()}
            className="w-11 h-10 flex items-center justify-center hover:bg-red/80 transition-colors"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>
      </div>
    </div>
  )
}
