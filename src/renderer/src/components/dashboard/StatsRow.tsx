import { useScanStore } from '../../store/scan-store'
import { formatBytesShort } from '../../lib/format'
import { Gamepad2, HardDrive, Trophy, MonitorPlay } from 'lucide-react'
import type { Platform } from '../../store/scan-store'

export default function StatsRow() {
  const { games, disks } = useScanStore()

  const totalGames = games.length
  const totalStorage = games.reduce((sum, g) => sum + g.sizeBytes, 0)

  const largestGame = games.length > 0
    ? games.reduce((max, g) => g.sizeBytes > max.sizeBytes ? g : max, games[0])
    : null

  const platformCounts = games.reduce<Record<string, number>>((acc, g) => {
    acc[g.platform] = (acc[g.platform] || 0) + 1
    return acc
  }, {})
  const dominantPlatform = Object.entries(platformCounts).sort((a, b) => b[1] - a[1])[0]

  const platformLabels: Record<Platform, string> = {
    steam: 'Steam', epic: 'Epic', gog: 'GOG', xbox: 'Xbox',
    battlenet: 'Battle.net', ubisoft: 'Ubisoft', ea: 'EA', emulator: 'Emulator', other: 'Other'
  }

  const stats = [
    {
      icon: <Gamepad2 size={20} className="text-accent" />,
      label: 'Total Games Detected',
      value: totalGames.toString(),
      sub: totalGames > 0 ? `Across ${disks.filter(d => d.gameCount > 0).length} volumes` : 'No data'
    },
    {
      icon: <HardDrive size={20} className="text-accent" />,
      label: 'Storage Occupied',
      value: formatBytesShort(totalStorage),
      sub: `${disks.length} drives scanned`
    },
    {
      icon: <Trophy size={20} className="text-yellow" />,
      label: 'Largest Game',
      value: largestGame ? largestGame.name.substring(0, 18) + (largestGame.name.length > 18 ? '...' : '') : '--',
      sub: largestGame ? formatBytesShort(largestGame.sizeBytes) : '--'
    },
    {
      icon: <MonitorPlay size={20} className="text-accent" />,
      label: 'Dominant Platform',
      value: dominantPlatform ? platformLabels[dominantPlatform[0] as Platform] || dominantPlatform[0] : '--',
      sub: dominantPlatform ? `${dominantPlatform[1]} titles` : '--'
    }
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card-cyber-solid">
          <div className="flex items-center gap-2 mb-2">
            {stat.icon}
            <span className="text-label">{stat.label}</span>
          </div>
          <div className="text-data">{stat.value}</div>
          <div className="text-mono text-[0.65rem] text-text-muted mt-1">{stat.sub}</div>
        </div>
      ))}
    </div>
  )
}
