import { LayoutDashboard, Gamepad2, Radar, Settings, Zap } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import type { View } from '../../store/scan-store'

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'scan', label: 'Scan', icon: Radar },
  { id: 'settings', label: 'Settings', icon: Settings }
]

export default function Sidebar() {
  const { view, setView, games, scannedAt } = useScanStore()

  return (
    <div className="w-52 bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-accent" />
          <div>
            <div className="text-mono text-xs font-bold text-accent tracking-wider">GAMEVAULT</div>
            <div className="text-mono text-[0.55rem] text-text-muted tracking-widest uppercase">Kinetic Scanner</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-mono text-xs tracking-wider uppercase transition-all ${
              view === id
                ? 'bg-accent-dim text-accent border-l-2 border-accent'
                : 'text-text-muted hover:bg-card-hover hover:text-text-secondary'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        {scannedAt && (
          <div className="text-mono text-[0.6rem] text-text-muted text-center">
            {games.length} games indexed
          </div>
        )}
        <div className="text-mono text-[0.5rem] text-text-muted text-center mt-2 opacity-50">
          v1.0.0
        </div>
      </div>
    </div>
  )
}
