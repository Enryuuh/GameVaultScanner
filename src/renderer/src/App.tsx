import { useEffect } from 'react'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import DiskOverview from './components/dashboard/DiskOverview'
import DiskChart from './components/dashboard/DiskChart'
import ScanProgress from './components/dashboard/ScanProgress'
import GameList from './components/games/GameList'
import { useScanStore } from './store/scan-store'
import { HardDrive, Gamepad2 } from 'lucide-react'

function Dashboard() {
  const { scannedAt, games, scanning } = useScanStore()

  return (
    <div className="space-y-6">
      <ScanProgress />
      <DiskOverview />

      {scannedAt && games.length > 0 && <DiskChart />}

      {!scannedAt && !scanning && (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted gap-4">
          <div className="relative">
            <HardDrive size={56} strokeWidth={1} className="text-accent/30" />
            <Gamepad2 size={24} className="absolute -bottom-1 -right-1 text-cyan/40" />
          </div>
          <p className="text-lg font-medium text-text-secondary">Bienvenido a GameVault Scanner</p>
          <p className="text-sm text-center max-w-md">
            Escanea tu PC para descubrir todos los videojuegos instalados,
            organizados por disco duro y plataforma.
          </p>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { view, setDisks, setResults } = useScanStore()

  // Auto-load disk info and cache on startup
  useEffect(() => {
    window.api.getDiskInfo().then((disks) => {
      if (disks.length > 0) setDisks(disks)
    })

    window.api.loadCache().then((cached) => {
      if (cached) setResults(cached)
    })
  }, [])

  return (
    <>
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'dashboard' ? <Dashboard /> : <GameList />}
        </main>
      </div>
    </>
  )
}
