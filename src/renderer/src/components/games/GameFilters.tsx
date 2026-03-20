import { useScanStore } from '../../store/scan-store'
import type { Platform } from '../../store/scan-store'
import { Search } from 'lucide-react'

const PLATFORMS: { id: Platform | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'steam', label: 'Steam' },
  { id: 'epic', label: 'Epic' },
  { id: 'gog', label: 'GOG' },
  { id: 'battlenet', label: 'Battle.net' },
  { id: 'xbox', label: 'Xbox' },
  { id: 'ubisoft', label: 'Ubisoft' },
  { id: 'ea', label: 'EA' },
  { id: 'emulator', label: 'Emulator' }
]

const SIZE_CLASSES = [
  { id: null, label: 'All Sizes' },
  { id: '<1', label: '< 1 GB' },
  { id: '1-10', label: '1-10 GB' },
  { id: '10-50', label: '10-50 GB' },
  { id: '50-100', label: '50-100 GB' },
  { id: '>100', label: '> 100 GB' }
]

const pillActive = 'bg-accent text-bg font-bold border border-accent'
const pillInactive = 'bg-card text-text-secondary border border-border hover:border-accent/50 hover:text-text'

export default function GameFilters() {
  const { filters, setFilter, disks } = useScanStore()

  const uniqueDrives = disks.filter((d) => d.gameCount > 0).map((d) => d.drive)

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search vault..."
          value={filters.search}
          onChange={(e) => setFilter('search', e.target.value || '')}
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-mono text-xs text-text placeholder-text-muted focus:border-accent/50 focus:outline-none transition-colors"
        />
      </div>

      {/* Platform pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-mono text-[0.65rem] uppercase tracking-widest text-text-muted mr-1">Platform</span>
        {PLATFORMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter('platform', id === 'all' ? null : id)}
            className={`px-3 py-1.5 rounded-md text-mono text-[0.7rem] uppercase tracking-wider transition-all cursor-pointer ${
              (id === 'all' && !filters.platform) || filters.platform === id
                ? pillActive
                : pillInactive
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Drive pills + Size class */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-mono text-[0.65rem] uppercase tracking-widest text-text-muted mr-1">Drive</span>
          <button
            onClick={() => setFilter('drive', null)}
            className={`px-3 py-1.5 rounded-md text-mono text-[0.7rem] uppercase tracking-wider transition-all cursor-pointer ${
              !filters.drive ? pillActive : pillInactive
            }`}
          >
            All
          </button>
          {uniqueDrives.map((drive) => (
            <button
              key={drive}
              onClick={() => setFilter('drive', drive)}
              className={`px-3 py-1.5 rounded-md text-mono text-[0.7rem] uppercase tracking-wider transition-all cursor-pointer ${
                filters.drive === drive ? pillActive : pillInactive
              }`}
            >
              {drive}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-mono text-[0.65rem] uppercase tracking-widest text-text-muted mr-1">Size Class</span>
          <select
            value={filters.sizeClass || ''}
            onChange={(e) => setFilter('sizeClass', e.target.value || null)}
            className="px-3 py-1.5 rounded-md bg-card border border-border text-mono text-[0.7rem] text-text-secondary focus:border-accent/50 focus:outline-none cursor-pointer"
          >
            {SIZE_CLASSES.map(({ id, label }) => (
              <option key={label} value={id || ''}>{label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
