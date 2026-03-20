import { create } from 'zustand'

interface DiskInfo {
  drive: string
  label: string
  totalBytes: number
  usedBytes: number
  freeBytes: number
  gamesBytes: number
  gameCount: number
}

type Platform =
  | 'steam' | 'epic' | 'gog' | 'xbox'
  | 'battlenet' | 'ubisoft' | 'ea'
  | 'emulator' | 'other'

interface DetectedGame {
  name: string
  path: string
  sizeBytes: number
  platform: Platform
  drive: string
  appId?: string
  lastPlayed?: number
}

interface ScanProgress {
  phase: string
  current: number
  total: number
  detail?: string
}

interface ScanResults {
  games: DetectedGame[]
  disks: DiskInfo[]
  scannedAt: number
}

type View = 'dashboard' | 'games'

interface Filters {
  drive: string | null
  platform: Platform | null
  search: string
}

interface ScanStore {
  // State
  view: View
  scanning: boolean
  progress: ScanProgress | null
  disks: DiskInfo[]
  games: DetectedGame[]
  scannedAt: number | null
  filters: Filters

  // Actions
  setView: (view: View) => void
  setScanning: (scanning: boolean) => void
  setProgress: (progress: ScanProgress | null) => void
  setResults: (results: ScanResults) => void
  setDisks: (disks: DiskInfo[]) => void
  setFilter: (key: keyof Filters, value: string | null) => void
  filteredGames: () => DetectedGame[]
}

export const useScanStore = create<ScanStore>((set, get) => ({
  view: 'dashboard',
  scanning: false,
  progress: null,
  disks: [],
  games: [],
  scannedAt: null,
  filters: { drive: null, platform: null, search: '' },

  setView: (view) => set({ view }),
  setScanning: (scanning) => set({ scanning }),
  setProgress: (progress) => set({ progress }),
  setResults: (results) =>
    set({
      games: results.games,
      disks: results.disks,
      scannedAt: results.scannedAt,
      scanning: false,
      progress: null
    }),
  setDisks: (disks) => set({ disks }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value }
    })),

  filteredGames: () => {
    const { games, filters } = get()
    return games.filter((g) => {
      if (filters.drive && g.drive !== filters.drive) return false
      if (filters.platform && g.platform !== filters.platform) return false
      if (filters.search && !g.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      return true
    })
  }
}))

export type { DiskInfo, DetectedGame, ScanProgress, ScanResults, Platform, View, Filters }
