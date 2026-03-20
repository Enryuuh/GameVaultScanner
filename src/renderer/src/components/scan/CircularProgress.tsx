interface CircularProgressProps {
  percentage: number
  label?: string
  size?: number
}

export default function CircularProgress({ percentage, label = 'DATA INTEGRITY', size = 200 }: CircularProgressProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px var(--color-accent-glow))'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-mono text-4xl font-bold text-text glow-text-cyan">
          {Math.round(percentage)}
          <span className="text-lg text-text-muted">%</span>
        </span>
        <span className="text-label mt-1">{label}</span>
      </div>
    </div>
  )
}
