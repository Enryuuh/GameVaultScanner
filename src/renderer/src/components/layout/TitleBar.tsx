import { Minus, Square, X, HardDrive } from 'lucide-react'

export default function TitleBar() {
  return (
    <div className="flex items-center justify-between h-9 bg-surface border-b border-border select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center gap-2 pl-3">
        <HardDrive size={16} className="text-accent" />
        <span className="text-sm font-semibold text-text-secondary">GameVault Scanner</span>
      </div>

      <div className="flex" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => window.api.minimizeWindow()}
          className="w-11 h-9 flex items-center justify-center hover:bg-card transition-colors"
        >
          <Minus size={14} className="text-text-secondary" />
        </button>
        <button
          onClick={() => window.api.maximizeWindow()}
          className="w-11 h-9 flex items-center justify-center hover:bg-card transition-colors"
        >
          <Square size={12} className="text-text-secondary" />
        </button>
        <button
          onClick={() => window.api.closeWindow()}
          className="w-11 h-9 flex items-center justify-center hover:bg-red transition-colors"
        >
          <X size={14} className="text-text-secondary" />
        </button>
      </div>
    </div>
  )
}
