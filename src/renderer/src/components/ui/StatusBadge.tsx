type BadgeVariant = 'healthy' | 'critical' | 'optimized' | 'ready' | 'in-progress' | 'busy'

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
  const text = label || variant.replace('-', ' ')
  return (
    <span className={`badge badge-${variant}`}>
      {text}
    </span>
  )
}
