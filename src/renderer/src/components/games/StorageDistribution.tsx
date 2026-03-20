import { useScanStore } from '../../store/scan-store'
import { formatBytesShort } from '../../lib/format'

export default function StorageDistribution() {
  const { disks, games } = useScanStore()

  const drivesWithGames = disks.filter((d) => d.gameCount > 0)
  if (drivesWithGames.length === 0) return null

  return (
    <div className="card-cyber-solid p-3">
      <span className="text-label">Storage Distribution Vitals</span>
      <div className="grid grid-cols-3 gap-4 mt-3">
        {drivesWithGames.map((disk) => {
          const pct = disk.totalBytes > 0 ? (disk.usedBytes / disk.totalBytes) * 100 : 0
          const gamesPct = disk.totalBytes > 0 ? (disk.gamesBytes / disk.totalBytes) * 100 : 0

          return (
            <div key={disk.drive}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-mono text-[0.6rem] text-text-secondary uppercase">
                  {disk.label || 'System'} ({disk.drive})
                </span>
                <span className="text-mono text-[0.55rem] text-text-muted">
                  {formatBytesShort(disk.usedBytes)} / {formatBytesShort(disk.totalBytes)}
                </span>
              </div>
              <div className="w-full h-2 bg-bg rounded overflow-hidden flex">
                <div className="h-full bg-accent" style={{ width: `${gamesPct}%` }} />
                <div className="h-full bg-border/60" style={{ width: `${Math.max(0, pct - gamesPct)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
