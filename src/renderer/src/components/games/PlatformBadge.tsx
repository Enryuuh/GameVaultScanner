import type { Platform } from '../../store/scan-store'

const PLATFORM_CONFIG: Record<Platform, { label: string; bg: string; text: string }> = {
  steam: { label: 'Steam', bg: 'bg-[#1b2838]', text: 'text-[#66c0f4]' },
  epic: { label: 'Epic', bg: 'bg-[#2a2a2a]', text: 'text-white' },
  battlenet: { label: 'Battle.net', bg: 'bg-[#002855]', text: 'text-[#00AEFF]' },
  gog: { label: 'GOG', bg: 'bg-[#2c1a4a]', text: 'text-[#aa55ff]' },
  xbox: { label: 'Xbox', bg: 'bg-[#0e3d0e]', text: 'text-[#5dc21e]' },
  ubisoft: { label: 'Ubisoft', bg: 'bg-[#001a40]', text: 'text-[#0070ff]' },
  ea: { label: 'EA', bg: 'bg-[#3d1010]', text: 'text-[#ff4747]' },
  emulator: { label: 'Emulator', bg: 'bg-[#3d2e0a]', text: 'text-[#ff8800]' },
  other: { label: 'Other', bg: 'bg-[#1e293b]', text: 'text-[#94a3b8]' }
}

export default function PlatformBadge({ platform }: { platform: Platform }) {
  const config = PLATFORM_CONFIG[platform]

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.55rem] font-semibold uppercase tracking-wider ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  )
}
