import { useScanStore } from '../../store/scan-store'
import { AlertTriangle } from 'lucide-react'
import { formatBytesShort } from '../../lib/format'

export default function DiskAlerts() {
  const disks = useScanStore((s) => s.disks)

  const criticalDisks = disks.filter((d) => {
    if (d.totalBytes === 0) return false
    const usedPercent = (d.usedBytes / d.totalBytes) * 100
    return usedPercent >= 90
  })

  if (criticalDisks.length === 0) return null

  return (
    <div className="space-y-2">
      {criticalDisks.map((disk) => {
        const usedPercent = Math.round((disk.usedBytes / disk.totalBytes) * 100)
        const isCritical = usedPercent >= 95
        return (
          <div
            key={disk.drive}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
              isCritical
                ? 'border-red/50 bg-red/5'
                : 'border-yellow-500/50 bg-yellow-500/5'
            }`}
          >
            <AlertTriangle
              size={16}
              className={isCritical ? 'text-red' : 'text-yellow-500'}
            />
            <div className="flex-1">
              <span className={`text-mono text-xs font-bold ${isCritical ? 'text-red' : 'text-yellow-500'}`}>
                {isCritical ? 'CRITICAL' : 'WARNING'}
              </span>
              <span className="text-mono text-xs text-text-muted ml-2">
                Drive {disk.drive} ({disk.label || 'Local'}) is {usedPercent}% full — only {formatBytesShort(disk.freeBytes)} free
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
