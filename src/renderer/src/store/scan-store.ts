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

type View = 'dashboard' | 'games' | 'scan' | 'settings'

interface Filters {
  drive: string | null
  platform: Platform | null
  search: string
  sizeClass: string | null
}

interface ScanLogEntry {
  timestamp: number
  type: 'OK' | 'SCAN' | 'IDENT' | 'BUSY' | 'ERROR'
  message: string
}

interface AppSettings {
  scanPaths: string[]
  platformToggles: Record<Platform, boolean>
  autoUpdate: boolean
}

const defaultSettings: AppSettings = {
  scanPaths: [],
  platformToggles: {
    steam: true,
    epic: true,
    gog: true,
    xbox: true,
    battlenet: true,
    ubisoft: true,
    ea: true,
    emulator: true,
    other: true
  },
  autoUpdate: true
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
  scanLog: ScanLogEntry[]
  scanElapsed: number
  pagination: { page: number; pageSize: number }
  settings: AppSettings

  // Actions
  setView: (view: View) => void
  setScanning: (scanning: boolean) => void
  setProgress: (progress: ScanProgress | null) => void
  setResults: (results: ScanResults) => void
  setDisks: (disks: DiskInfo[]) => void
  setFilter: (key: keyof Filters, value: string | null) => void
  filteredGames: () => DetectedGame[]
  addScanLog: (entry: ScanLogEntry) => void
  clearScanLog: () => void
  setScanElapsed: (elapsed: number) => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setSettings: (settings: Partial<AppSettings>) => void
  addScanPath: (path: string) => void
  removeScanPath: (path: string) => void
  togglePlatform: (platform: Platform) => void
}

export const useScanStore = create<ScanStore>((set, get) => ({
  view: 'dashboard',
  scanning: false,
  progress: null,
  disks: [],
  games: [],
  scannedAt: null,
  filters: { drive: null, platform: null, search: '', sizeClass: null },
  scanLog: [],
  scanElapsed: 0,
  pagination: { page: 1, pageSize: 10 },
  settings: defaultSettings,

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
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 }
    })),

  filteredGames: () => {
    const { games, filters } = get()
    return games.filter((g) => {
      if (filters.drive && g.drive !== filters.drive) return false
      if (filters.platform && g.platform !== filters.platform) return false
      if (filters.search && !g.name.toLowerCase().includes(filters.search.toLowerCase()))
        return false
      if (filters.sizeClass) {
        const gb = g.sizeBytes / (1024 ** 3)
        switch (filters.sizeClass) {
          case '<1': if (gb >= 1) return false; break
          case '1-10': if (gb < 1 || gb >= 10) return false; break
          case '10-50': if (gb < 10 || gb >= 50) return false; break
          case '50-100': if (gb < 50 || gb >= 100) return false; break
          case '>100': if (gb < 100) return false; break
        }
      }
      return true
    })
  },

  addScanLog: (entry) =>
    set((state) => ({ scanLog: [...state.scanLog, entry] })),
  clearScanLog: () => set({ scanLog: [], scanElapsed: 0 }),
  setScanElapsed: (elapsed) => set({ scanElapsed: elapsed }),
  setPage: (page) =>
    set((state) => ({ pagination: { ...state.pagination, page } })),
  setPageSize: (size) =>
    set((state) => ({ pagination: { ...state.pagination, pageSize: size, page: 1 } })),
  setSettings: (settings) =>
    set((state) => ({ settings: { ...state.settings, ...settings } })),
  addScanPath: (path) =>
    set((state) => ({
      settings: { ...state.settings, scanPaths: [...state.settings.scanPaths, path] }
    })),
  removeScanPath: (path) =>
    set((state) => ({
      settings: {
        ...state.settings,
        scanPaths: state.settings.scanPaths.filter((p) => p !== path)
      }
    })),
  togglePlatform: (platform) =>
    set((state) => ({
      settings: {
        ...state.settings,
        platformToggles: {
          ...state.settings.platformToggles,
          [platform]: !state.settings.platformToggles[platform]
        }
      }
    }))
}))

export type {
  DiskInfo, DetectedGame, ScanProgress, ScanResults,
  Platform, View, Filters, ScanLogEntry, AppSettings
}
