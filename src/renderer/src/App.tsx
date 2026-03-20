import { useEffect } from 'react'
import TitleBar from './components/layout/TitleBar'
import Sidebar from './components/layout/Sidebar'
import DashboardView from './components/dashboard/DashboardView'
import ScanView from './components/scan/ScanView'
import GameList from './components/games/GameList'
import SettingsView from './components/settings/SettingsView'
import { useScanStore } from './store/scan-store'

export default function App() {
  const { view, setDisks, setResults, setSettings } = useScanStore()

  useEffect(() => {
    window.api.getDiskInfo().then((disks) => {
      if (disks.length > 0) setDisks(disks)
    })

    window.api.loadCache().then((cached) => {
      if (cached) setResults(cached)
    })

    window.api.loadSettings().then((settings) => {
      if (settings) setSettings(settings)
    })
  }, [])

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <DashboardView />
      case 'scan': return <ScanView />
      case 'games': return <GameList />
      case 'settings': return <SettingsView />
    }
  }

  return (
    <>
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in" key={view}>
          {renderView()}
        </main>
      </div>
    </>
  )
}
