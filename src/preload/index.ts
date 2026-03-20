import { contextBridge, ipcRenderer } from 'electron'
import type { DiskInfo, ScanResults, ScanProgress } from '../main/types'

export interface AppSettings {
  scanPaths: string[]
  platformToggles: Record<string, boolean>
  autoUpdate: boolean
}

export interface ElectronAPI {
  startScan: () => Promise<ScanResults | null>
  getDiskInfo: () => Promise<DiskInfo[]>
  loadCache: () => Promise<ScanResults | null>
  onScanProgress: (callback: (progress: ScanProgress) => void) => () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
  loadSettings: () => Promise<AppSettings | null>
  saveSettings: (settings: AppSettings) => Promise<void>
  clearCache: () => Promise<boolean>
  openPath: (path: string) => Promise<void>
  selectFolder: () => Promise<string | null>
}

const api: ElectronAPI = {
  startScan: () => ipcRenderer.invoke('scan:start'),
  getDiskInfo: () => ipcRenderer.invoke('disk:info'),
  loadCache: () => ipcRenderer.invoke('cache:load'),
  onScanProgress: (callback) => {
    const handler = (_: unknown, progress: ScanProgress): void => callback(progress)
    ipcRenderer.on('scan:progress', handler)
    return () => ipcRenderer.removeListener('scan:progress', handler)
  },
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),
  clearCache: () => ipcRenderer.invoke('cache:clear'),
  openPath: (path) => ipcRenderer.invoke('path:open', path),
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder')
}

contextBridge.exposeInMainWorld('api', api)
