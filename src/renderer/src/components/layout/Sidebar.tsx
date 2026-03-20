import { LayoutDashboard, Gamepad2, RotateCw } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import type { View } from '../../store/scan-store'

const NAV_ITEMS: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'games', label: 'Juegos', icon: Gamepad2 }
]

export default function Sidebar() {
  const { view, setView, scanning, games, scannedAt } = useScanStore()

  const handleScan = async () => {
    if (scanning) return
    useScanStore.getState().setScanning(true)

    const unsub = window.api.onScanProgress((progress) => {
      useScanStore.getState().setProgress(progress)
    })

    try {
      const results = await window.api.startScan()
      if (results) {
        useScanStore.getState().setResults(results)
      }
    } finally {
      useScanStore.getState().setScanning(false)
      unsub()
    }
  }

  return (
    <div className="w-56 bg-surface border-r border-border flex flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              view === id
                ? 'bg-accent/15 text-accent-light'
                : 'text-text-secondary hover:bg-card hover:text-text'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-3 border-t border-border">
        {scannedAt && (
          <div className="text-xs text-text-muted text-center">
            {games.length} juegos encontrados
          </div>
        )}
        <button
          onClick={handleScan}
          disabled={scanning}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            scanning
              ? 'bg-card text-text-muted cursor-not-allowed'
              : 'bg-accent hover:bg-accent-light text-white'
          }`}
        >
          <RotateCw size={16} className={scanning ? 'animate-spin' : ''} />
          {scanning ? 'Escaneando...' : 'Escanear'}
        </button>
      </div>
    </div>
  )
}
