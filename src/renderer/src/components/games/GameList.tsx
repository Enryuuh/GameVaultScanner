import { useMemo } from 'react'
import { Gamepad2, RefreshCw, FolderOpen, Download } from 'lucide-react'
import { useScanStore } from '../../store/scan-store'
import { formatBytesShort, exportGamesCSV, downloadFile } from '../../lib/format'
import GameFilters from './GameFilters'
import GameTable from './GameTable'
import Pagination from './Pagination'
import VaultSizeDonut from './VaultSizeDonut'
import StorageDistribution from './StorageDistribution'

export default function GameList() {
  const games = useScanStore((s) => s.games)
  const scannedAt = useScanStore((s) => s.scannedAt)
  const filteredGames = useScanStore((s) => s.filteredGames)
  const { page, pageSize } = useScanStore((s) => s.pagination)
  const disks = useScanStore((s) => s.disks)

  const filtered = useMemo(() => filteredGames(), [games, useScanStore((s) => s.filters)])
  const totalSize = useMemo(() => filtered.reduce((sum, g) => sum + g.sizeBytes, 0), [filtered])

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedGames = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize]
  )

  if (!scannedAt) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-text-muted gap-4">
        <Gamepad2 size={48} strokeWidth={1} className="text-accent/20" />
        <p className="text-mono text-sm text-text-secondary">No scan data available</p>
        <p className="text-xs">Navigate to Scan tab to initiate detection</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-mono text-2xl font-bold text-text">
            Games <span className="text-accent">Library</span>
          </h1>
          <p className="text-[0.7rem] text-text-muted mt-1">
            Advanced kinetic scanning protocol complete. {filtered.length} detected entities across {disks.filter(d => d.gameCount > 0).length} local storage volumes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csv = exportGamesCSV(filtered)
              downloadFile(csv, 'gamevault-games.csv', 'text/csv')
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-text-muted text-mono text-[0.65rem] uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
          >
            <Download size={12} />
            Export CSV
          </button>
          <button
            onClick={() => {
              const json = JSON.stringify(filtered.map(g => ({
                name: g.name, platform: g.platform, drive: g.drive,
                path: g.path, sizeGB: +(g.sizeBytes / (1024 ** 3)).toFixed(2)
              })), null, 2)
              downloadFile(json, 'gamevault-games.json', 'application/json')
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-text-muted text-mono text-[0.65rem] uppercase tracking-wider hover:border-accent hover:text-accent transition-all"
          >
            <Download size={12} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Filters + Vault Size */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <GameFilters />
        </div>
        <VaultSizeDonut totalSize={totalSize} totalCapacity={disks.reduce((s, d) => s + d.totalBytes, 0)} />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <GameTable games={paginatedGames} startIndex={(page - 1) * pageSize} />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={pageSize}
      />

      {/* Storage Distribution */}
      <StorageDistribution />
    </div>
  )
}
