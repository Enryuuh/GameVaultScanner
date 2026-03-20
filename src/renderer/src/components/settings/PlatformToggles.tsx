import { useScanStore } from '../../store/scan-store'
import type { Platform } from '../../store/scan-store'
import ToggleSwitch from '../ui/ToggleSwitch'

const PLATFORMS: { platform: Platform; label: string; icon: string }[] = [
  { platform: 'steam', label: 'Steam Network', icon: '🎮' },
  { platform: 'epic', label: 'Epic Launcher', icon: '🏪' },
  { platform: 'gog', label: 'GOG Galaxy', icon: '🌐' },
  { platform: 'ubisoft', label: 'Ubisoft Connect', icon: '🔷' },
  { platform: 'battlenet', label: 'Battle.net', icon: '⚔️' },
  { platform: 'ea', label: 'EA App', icon: '🔴' },
  { platform: 'xbox', label: 'Xbox / MS Store', icon: '🟢' },
  { platform: 'emulator', label: 'Emulators', icon: '🕹️' }
]

export default function PlatformToggles() {
  const { settings, togglePlatform } = useScanStore()

  const handleToggle = (platform: Platform) => {
    togglePlatform(platform)
    setTimeout(() => {
      window.api.saveSettings(useScanStore.getState().settings)
    }, 0)
  }

  return (
    <div className="card-cyber-accent">
      <h3 className="text-mono text-sm font-bold text-text mb-4">Platform Ecosystems</h3>

      <div className="grid grid-cols-2 gap-3">
        {PLATFORMS.map(({ platform, label, icon }) => (
          <div
            key={platform}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              settings.platformToggles[platform]
                ? 'bg-surface border border-accent/20'
                : 'bg-surface border border-border'
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="flex-1 text-mono text-[0.65rem] text-text-secondary">{label}</span>
            <ToggleSwitch
              enabled={settings.platformToggles[platform]}
              onChange={() => handleToggle(platform)}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
