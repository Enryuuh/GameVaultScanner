import { useScanStore } from '../../store/scan-store'
import { formatBytesShort } from '../../lib/format'
import type { Platform } from '../../store/scan-store'

const PLATFORM_COLORS: Record<Platform, string> = {
  steam: '#1b78d0',
  epic: '#2a2a2a',
  gog: '#aa55ff',
  xbox: '#107c10',
  battlenet: '#00aeff',
  ubisoft: '#0070ff',
  ea: '#ff4444',
  emulator: '#ff8800',
  other: '#484f58'
}

const PLATFORM_LABELS: Record<Platform, string> = {
  steam: 'Steam', epic: 'Epic', gog: 'GOG', xbox: 'Xbox',
  battlenet: 'Battle.net', ubisoft: 'Ubisoft', ea: 'EA',
  emulator: 'Emulator', other: 'Other'
}

export default function KineticStorageMap() {
  const { disks, games } = useScanStore()

  // Get per-disk platform breakdown
  const diskBreakdowns = disks.map((disk) => {
    const diskGames = games.filter((g) => g.drive === disk.drive)
    const platformBreakdown: { platform: Platform; bytes: number }[] = []

    const byPlatform = diskGames.reduce<Record<string, number>>((acc, g) => {
      acc[g.platform] = (acc[g.platform] || 0) + g.sizeBytes
      return acc
    }, {})

    for (const [platform, bytes] of Object.entries(byPlatform)) {
      platformBreakdown.push({ platform: platform as Platform, bytes })
    }

    platformBreakdown.sort((a, b) => b.bytes - a.bytes)
    return { disk, breakdown: platformBreakdown }
  })

  // Find all platforms present for legend
  const activePlatforms = new Set<Platform>()
  diskBreakdowns.forEach(({ breakdown }) => {
    breakdown.forEach(({ platform }) => activePlatforms.add(platform))
  })

  return (
    <div className="card-cyber-solid">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-mono text-sm font-bold text-text">Kinetic Storage Map</h3>
          <p className="text-[0.6rem] text-text-muted mt-0.5">Real-time visualization of data distribution across kinetic sectors</p>
        </div>
        <div className="flex items-center gap-3">
          {Array.from(activePlatforms).slice(0, 5).map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[p] }} />
              <span className="text-mono text-[0.6rem] text-text-muted">{PLATFORM_LABELS[p]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {diskBreakdowns.map(({ disk, breakdown }) => {
          const usedPct = disk.totalBytes > 0 ? (disk.usedBytes / disk.totalBytes) * 100 : 0
          return (
            <div key={disk.drive}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-mono text-[0.65rem] uppercase tracking-wider text-text-secondary">
                  Drive {disk.drive} ({disk.label || 'Local'})
                </span>
                <span className="text-mono text-[0.65rem] text-text-muted">
                  {formatBytesShort(disk.usedBytes)} / {formatBytesShort(disk.totalBytes)}
                </span>
              </div>
              <div className="w-full h-6 bg-bg rounded overflow-hidden flex">
                {breakdown.map(({ platform, bytes }) => {
                  const pct = disk.totalBytes > 0 ? (bytes / disk.totalBytes) * 100 : 0
                  if (pct < 0.5) return null
                  return (
                    <div
                      key={platform}
                      className="h-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: PLATFORM_COLORS[platform]
                      }}
                      title={`${PLATFORM_LABELS[platform]}: ${formatBytesShort(bytes)}`}
                    />
                  )
                })}
                {/* Remaining used space (non-game) */}
                {usedPct > 0 && (
                  <div
                    className="h-full bg-border/50"
                    style={{
                      width: `${Math.max(0, usedPct - breakdown.reduce((s, b) => s + (disk.totalBytes > 0 ? (b.bytes / disk.totalBytes) * 100 : 0), 0))}%`
                    }}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
