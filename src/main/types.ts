export type Platform =
  | 'steam'
  | 'epic'
  | 'gog'
  | 'xbox'
  | 'battlenet'
  | 'ubisoft'
  | 'ea'
  | 'emulator'
  | 'other'

export interface DetectedGame {
  name: string
  path: string
  sizeBytes: number
  platform: Platform
  drive: string
  appId?: string
  lastPlayed?: number
}

export interface DiskInfo {
  drive: string
  label: string
  totalBytes: number
  usedBytes: number
  freeBytes: number
  gamesBytes: number
  gameCount: number
}

export interface ScanProgress {
  phase: string
  current: number
  total: number
  detail?: string
}

export interface ScanResults {
  games: DetectedGame[]
  disks: DiskInfo[]
  scannedAt: number
}

export interface GameScanner {
  platform: Platform
  scan(): Promise<DetectedGame[]>
}
