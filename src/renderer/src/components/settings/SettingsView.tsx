import ScanPaths from './ScanPaths'
import PlatformToggles from './PlatformToggles'
import CacheManagement from './CacheManagement'
import SystemInfo from './SystemInfo'

export default function SettingsView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-mono text-2xl font-bold text-text">Configuration</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-green" />
          <span className="text-mono text-[0.6rem] text-text-muted uppercase tracking-wider">
            Vault Kinetic Core v1.0.0-stable
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <ScanPaths />
          <PlatformToggles />
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <CacheManagement />
          <SystemInfo />
        </div>
      </div>
    </div>
  )
}
