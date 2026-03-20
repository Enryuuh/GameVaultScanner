import { useScanStore } from '../../store/scan-store'
import { Folder, Plus, X } from 'lucide-react'

export default function ScanPaths() {
  const { settings, addScanPath, removeScanPath } = useScanStore()

  const handleAddFolder = async () => {
    const path = await window.api.selectFolder()
    if (path) {
      addScanPath(path)
      window.api.saveSettings(useScanStore.getState().settings)
    }
  }

  return (
    <div className="card-cyber-accent">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-mono text-sm font-bold text-text">Scan Paths</h3>
          <p className="text-[0.6rem] text-text-muted mt-0.5">Directories indexed for game library detection</p>
        </div>
        <button
          onClick={handleAddFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-muted text-mono text-[0.6rem] uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
        >
          <Plus size={12} />
          Add Folder
        </button>
      </div>

      <div className="space-y-2">
        {settings.scanPaths.length === 0 ? (
          <div className="text-center py-4 text-text-muted text-xs">
            Default system paths are scanned automatically. Add custom paths to extend detection.
          </div>
        ) : (
          settings.scanPaths.map((path) => (
            <div
              key={path}
              className="flex items-center gap-3 p-3 bg-surface rounded-lg"
            >
              <Folder size={16} className="text-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-mono text-xs text-text truncate">{path}</div>
                <div className="text-[0.55rem] text-text-muted">Custom Path</div>
              </div>
              <button
                onClick={() => {
                  removeScanPath(path)
                  window.api.saveSettings(useScanStore.getState().settings)
                }}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red/20 transition-colors"
              >
                <X size={12} className="text-text-muted hover:text-red" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
