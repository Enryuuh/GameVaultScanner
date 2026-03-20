import { useScanStore } from '../../store/scan-store'
import type { Platform } from '../../store/scan-store'

const PLATFORM_CONFIG: { platform: Platform; label: string; icon: string }[] = [
  { platform: 'steam', label: 'Steam', icon: '🎮' },
  { platform: 'epic', label: 'Epic Store', icon: '🏪' },
  { platform: 'gog', label: 'GOG.COM', icon: '🌐' },
  { platform: 'battlenet', label: 'Battle.net', icon: '⚔️' },
  { platform: 'xbox', label: 'Xbox', icon: '🟢' },
  { platform: 'ubisoft', label: 'Ubisoft', icon: '🔷' },
  { platform: 'ea', label: 'EA App', icon: '🔴' },
  { platform: 'emulator', label: 'Emulators', icon: '🕹️' }
]

export default function PlatformCards() {
  const games = useScanStore((s) => s.games)
  const scanning = useScanStore((s) => s.scanning)

  const counts = games.reduce<Record<string, number>>((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1
    return acc
  }, {})

  return (
    <div className="card-cyber-solid">
      <h3 className="text-mono text-xs font-bold text-text-secondary mb-3">Platforms Detected</h3>
      <div className="grid grid-cols-2 gap-2">
        {PLATFORM_CONFIG.map(({ platform, label, icon }) => {
          const count = counts[platform] || 0
          const active = count > 0

          return (
            <div
              key={platform}
              className={`card-cyber p-2.5 flex items-center gap-2 transition-all ${
                active ? 'border-accent/30' : ''
              }`}
            >
              <span className="text-lg">{icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-mono text-[0.6rem] text-text-muted uppercase">{label}</div>
                <div className={`text-mono text-sm font-bold ${active ? 'text-accent' : 'text-text-muted'}`}>
                  {scanning && count === 0 ? '--' : `${count} Games`}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
