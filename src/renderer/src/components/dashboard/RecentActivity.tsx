import { useScanStore } from '../../store/scan-store'
import { formatRelativeTime, formatBytesShort } from '../../lib/format'
import { Search, Gamepad2, RefreshCw, AlertTriangle } from 'lucide-react'
import StatusBadge from '../ui/StatusBadge'

export default function RecentActivity() {
  const { games, disks, scannedAt } = useScanStore()

  // Generate activity items from scan data
  const activities: {
    icon: React.ReactNode
    title: string
    description: string
    badge?: { variant: 'healthy' | 'critical'; label: string }
    time: string
  }[] = []

  if (scannedAt) {
    activities.push({
      icon: <Search size={14} className="text-accent" />,
      title: 'Full System Scan',
      description: `Completed • ${games.length} games found`,
      badge: { variant: 'healthy', label: 'Healthy' },
      time: formatRelativeTime(scannedAt)
    })

    // Latest added games
    const sorted = [...games].sort((a, b) => b.sizeBytes - a.sizeBytes)
    if (sorted[0]) {
      activities.push({
        icon: <Gamepad2 size={14} className="text-green" />,
        title: 'Largest Game',
        description: `${sorted[0].name} (${sorted[0].platform})`,
        time: formatBytesShort(sorted[0].sizeBytes)
      })
    }

    // Platform count
    const platforms = new Set(games.map((g) => g.platform))
    activities.push({
      icon: <RefreshCw size={14} className="text-purple" />,
      title: 'Platforms Indexed',
      description: `${platforms.size} platform ecosystems synced`,
      time: formatRelativeTime(scannedAt)
    })

    // Drive alert for drives with >90% usage
    const criticalDrives = disks.filter((d) => d.totalBytes > 0 && (d.usedBytes / d.totalBytes) > 0.9)
    if (criticalDrives.length > 0) {
      activities.push({
        icon: <AlertTriangle size={14} className="text-red" />,
        title: 'Drive Alert',
        description: `Volume ${criticalDrives[0].drive} below 10% free space`,
        badge: { variant: 'critical', label: 'Critical' },
        time: 'Active'
      })
    }
  }

  return (
    <div className="card-cyber-solid h-full">
      <h3 className="text-mono text-sm font-bold text-text mb-4 flex items-center gap-2">
        <RefreshCw size={14} className="text-accent" />
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-xs">No activity yet</div>
      ) : (
        <div className="space-y-3">
          {activities.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded hover:bg-card-hover transition-colors">
              <div className="w-8 h-8 rounded bg-card flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-text">{item.title}</span>
                  {item.badge && <StatusBadge variant={item.badge.variant} label={item.badge.label} />}
                </div>
                <p className="text-[0.65rem] text-text-muted mt-0.5 truncate">{item.description}</p>
              </div>
              <span className="text-mono text-[0.6rem] text-text-muted flex-shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
