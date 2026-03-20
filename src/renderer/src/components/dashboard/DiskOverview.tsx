import { HardDrive, Gamepad2 } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import { formatBytes, percentUsed } from '../../lib/format'

function DiskCard({ disk }: { disk: { drive: string; label: string; totalBytes: number; usedBytes: number; freeBytes: number; gamesBytes: number; gameCount: number } }) {
  const usedPct = percentUsed(disk.usedBytes, disk.totalBytes)
  const gamesPct = percentUsed(disk.gamesBytes, disk.totalBytes)

  const barColor =
    usedPct > 90 ? 'bg-red' : usedPct > 70 ? 'bg-yellow' : 'bg-accent'

  return (
    <div className="bg-card rounded-xl p-4 border border-border hover:border-accent/30 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <HardDrive size={18} className="text-accent" />
        <span className="font-semibold text-lg">{disk.drive}</span>
        {disk.label && (
          <span className="text-xs text-text-muted truncate">{disk.label}</span>
        )}
      </div>

      {/* Usage bar */}
      <div className="h-3 bg-bg rounded-full overflow-hidden mb-2">
        <div className="h-full relative rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 ${barColor} opacity-70`}
            style={{ width: `${usedPct}%` }}
          />
          {gamesPct > 0 && (
            <div
              className="absolute inset-y-0 left-0 bg-cyan"
              style={{ width: `${gamesPct}%` }}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between text-xs text-text-secondary mb-3">
        <span>{formatBytes(disk.usedBytes)} usado</span>
        <span>{formatBytes(disk.freeBytes)} libre</span>
      </div>

      <div className="text-xs text-text-muted">
        Total: {formatBytes(disk.totalBytes)}
      </div>

      {disk.gameCount > 0 && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
          <Gamepad2 size={14} className="text-cyan" />
          <span className="text-xs text-cyan">
            {disk.gameCount} juegos · {formatBytes(disk.gamesBytes)}
          </span>
        </div>
      )}
    </div>
  )
}

export default function DiskOverview() {
  const disks = useScanStore((s) => s.disks)

  if (disks.length === 0) return null

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 text-text-secondary">Discos</h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {disks.map((disk) => (
          <DiskCard key={disk.drive} disk={disk} />
        ))}
      </div>
    </div>
  )
}
