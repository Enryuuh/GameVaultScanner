interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  size?: 'sm' | 'md'
}

export default function ToggleSwitch({ enabled, onChange, size = 'md' }: ToggleSwitchProps) {
  const w = size === 'sm' ? 'w-8' : 'w-10'
  const h = size === 'sm' ? 'h-4' : 'h-5'
  const dot = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5'

  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`${w} ${h} rounded-full transition-colors relative flex-shrink-0 ${
        enabled ? 'bg-accent' : 'bg-border'
      }`}
    >
      <span
        className={`${dot} rounded-full bg-white absolute top-0.5 left-0.5 transition-transform ${
          enabled ? translate : 'translate-x-0'
        }`}
      />
    </button>
  )
}
