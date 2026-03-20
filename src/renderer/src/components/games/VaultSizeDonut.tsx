import { formatBytesShort, percentUsed } from '../../lib/format'

interface VaultSizeDonutProps {
  totalSize: number
  totalCapacity: number
}

export default function VaultSizeDonut({ totalSize, totalCapacity }: VaultSizeDonutProps) {
  const pct = percentUsed(totalSize, totalCapacity)
  const size = 70
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex items-center gap-3 card-cyber-solid p-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="var(--color-accent)" strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-mono text-[0.6rem] font-bold text-text">{pct}%</span>
        </div>
      </div>
      <div>
        <div className="text-label">Total Vault Size</div>
        <div className="text-mono text-lg font-bold text-text">{formatBytesShort(totalSize)}</div>
      </div>
    </div>
  )
}
