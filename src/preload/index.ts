import { contextBridge, ipcRenderer } from 'electron'
import type { DiskInfo, ScanResults, ScanProgress } from '../main/types'

export interface ElectronAPI {
  startScan: () => Promise<ScanResults | null>
  getDiskInfo: () => Promise<DiskInfo[]>
  loadCache: () => Promise<ScanResults | null>
  onScanProgress: (callback: (progress: ScanProgress) => void) => () => void
  minimizeWindow: () => void
  maximizeWindow: () => void
  closeWindow: () => void
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
  closeWindow: () => ipcRenderer.send('window:close')
}

contextBridge.exposeInMainWorld('api', api)
