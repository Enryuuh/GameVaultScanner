import { ipcMain, BrowserWindow, app, shell, dialog } from 'electron'
import { readFile, writeFile, mkdir, access, unlink } from 'fs/promises'
import { join } from 'path'
import { scanDisks } from './scanners/disk-scanner'
import { scanSteam } from './scanners/steam-scanner'
import { scanEpic } from './scanners/epic-scanner'
import { scanBattleNet } from './scanners/battlenet-scanner'
import { scanGog } from './scanners/gog-scanner'
import { scanXbox } from './scanners/xbox-scanner'
import { scanUbisoft } from './scanners/ubisoft-scanner'
import { scanEa } from './scanners/ea-scanner'
import { scanRegistry } from './scanners/registry-scanner'
import { scanEmulators } from './scanners/emulator-scanner'
import type { DetectedGame, DiskInfo, ScanResults, ScanProgress } from './types'

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

function getCachePaths(): { dir: string; file: string } {
  const dir = join(app.getPath('appData'), 'gamevault-scanner')
  return { dir, file: join(dir, 'cache.json') }
}

function sendProgress(win: BrowserWindow, progress: ScanProgress): void {
  win.webContents.send('scan:progress', progress)
}

function deduplicateGames(games: DetectedGame[]): DetectedGame[] {
  const seen = new Map<string, DetectedGame>()

  // Priority: specific platforms first, then 'other'
  const platformPriority: Record<string, number> = {
    steam: 10,
    epic: 9,
    battlenet: 8,
    gog: 7,
    ubisoft: 6,
    ea: 5,
    xbox: 4,
    emulator: 3,
    other: 1
  }

  for (const game of games) {
    const key = game.path.toLowerCase().replace(/[\\/]+/g, '/').replace(/\/+$/, '')
    const existing = seen.get(key)

    if (!existing || (platformPriority[game.platform] || 0) > (platformPriority[existing.platform] || 0)) {
      seen.set(key, game)
    }
  }

  return Array.from(seen.values())
}

function aggregateDisksWithGames(disks: DiskInfo[], games: DetectedGame[]): DiskInfo[] {
  return disks.map((disk) => {
    const diskGames = games.filter((g) => g.drive === disk.drive)
    return {
      ...disk,
      gamesBytes: diskGames.reduce((sum, g) => sum + g.sizeBytes, 0),
      gameCount: diskGames.length
    }
  })
}

async function loadCache(): Promise<ScanResults | null> {
  try {
    const { file } = getCachePaths()
    await access(file)
    const content = await readFile(file, 'utf-8')
    const cached = JSON.parse(content) as ScanResults
    if (Date.now() - cached.scannedAt < CACHE_MAX_AGE) {
      return cached
    }
  } catch {}
  return null
}

async function saveCache(results: ScanResults): Promise<void> {
  try {
    const { dir, file } = getCachePaths()
    await mkdir(dir, { recursive: true })
    await writeFile(file, JSON.stringify(results))
  } catch {}
}

export function registerIpcHandlers(): void {
  ipcMain.handle('disk:info', async () => {
    return scanDisks()
  })

  ipcMain.handle('cache:load', async () => {
    return loadCache()
  })

  ipcMain.handle('scan:start', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (!win) return null

    const scanners = [
      { name: 'Steam', fn: scanSteam },
      { name: 'Epic Games', fn: scanEpic },
      { name: 'Battle.net', fn: scanBattleNet },
      { name: 'GOG Galaxy', fn: scanGog },
      { name: 'Xbox / MS Store', fn: scanXbox },
      { name: 'Ubisoft Connect', fn: scanUbisoft },
      { name: 'EA App / Origin', fn: scanEa },
      { name: 'Emuladores', fn: scanEmulators },
      { name: 'Registro de Windows', fn: scanRegistry }
    ]

    const allGames: DetectedGame[] = []
    const total = scanners.length + 1 // +1 for disk scan

    // Scan disks first
    sendProgress(win, { phase: 'Escaneando discos...', current: 0, total })
    const disks = await scanDisks()

    // Scan all platforms
    const results = await Promise.allSettled(
      scanners.map(async (scanner, i) => {
        sendProgress(win, {
          phase: `Escaneando ${scanner.name}...`,
          current: i + 1,
          total,
          detail: scanner.name
        })
        return scanner.fn()
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        allGames.push(...result.value)
      }
    }

    const dedupedGames = deduplicateGames(allGames)

    // Sort by size descending
    dedupedGames.sort((a, b) => b.sizeBytes - a.sizeBytes)

    const finalDisks = aggregateDisksWithGames(disks, dedupedGames)

    const scanResults: ScanResults = {
      games: dedupedGames,
      disks: finalDisks,
      scannedAt: Date.now()
    }

    // Save cache
    await saveCache(scanResults)

    sendProgress(win, {
      phase: 'Escaneo completado',
      current: total,
      total,
      detail: `${dedupedGames.length} juegos encontrados`
    })

    return scanResults
  })

  // Settings
  ipcMain.handle('settings:load', async () => {
    try {
      const { dir } = getCachePaths()
      const file = join(dir, 'settings.json')
      await access(file)
      const content = await readFile(file, 'utf-8')
      return JSON.parse(content)
    } catch {
      return null
    }
  })

  ipcMain.handle('settings:save', async (_event, settings) => {
    try {
      const { dir } = getCachePaths()
      await mkdir(dir, { recursive: true })
      await writeFile(join(dir, 'settings.json'), JSON.stringify(settings, null, 2))
    } catch {}
  })

  ipcMain.handle('cache:clear', async () => {
    try {
      const { file } = getCachePaths()
      await unlink(file)
      return true
    } catch {
      return false
    }
  })

  ipcMain.handle('path:open', async (_event, path: string) => {
    shell.showItemInFolder(path)
  })

  ipcMain.handle('dialog:selectFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Scan Folder'
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  // Window controls
  ipcMain.on('window:minimize', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.minimize()
  })

  ipcMain.on('window:maximize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window:close', (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close()
  })
}
