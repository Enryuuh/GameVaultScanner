import type { ReactNode } from 'react'

interface CyberCardProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  variant?: 'dashed' | 'solid' | 'accent'
  className?: string
}

export default function CyberCard({ children, title, icon, variant = 'dashed', className = '' }: CyberCardProps) {
  const borderClass =
    variant === 'solid' ? 'card-cyber-solid' :
    variant === 'accent' ? 'card-cyber-accent' :
    'card-cyber'

  return (
    <div className={`${borderClass} ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <span className="text-label">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}
