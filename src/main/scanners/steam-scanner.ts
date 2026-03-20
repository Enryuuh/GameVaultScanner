import { readFile, readdir, access } from 'fs/promises'
import { join } from 'path'
import { parseVdf } from '../utils/vdf-parser'
import { getDriveLetter } from '../utils/size-calculator'
import { runPowerShell } from '../utils/powershell'
import type { DetectedGame } from '../types'

const KNOWN_STEAM_PATHS = [
  'C:\\Program Files (x86)\\Steam',
  'C:\\Program Files\\Steam',
  'D:\\Steam',
  'D:\\SteamLibrary',
  'E:\\Steam',
  'E:\\SteamLibrary',
  'F:\\Steam',
  'F:\\SteamLibrary'
]

async function findSteamPath(): Promise<string | null> {
  // Try registry first
  try {
    const regPath = await runPowerShell(
      `(Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\WOW6432Node\\Valve\\Steam' -ErrorAction SilentlyContinue).InstallPath`
    )
    if (regPath) return regPath
  } catch {}

  // Fallback to known paths
  for (const p of KNOWN_STEAM_PATHS) {
    try {
      await access(p)
      return p
    } catch {}
  }

  return null
}

async function getLibraryFolders(steamPath: string): Promise<string[]> {
  const folders: string[] = [steamPath]

  try {
    const vdfPath = join(steamPath, 'steamapps', 'libraryfolders.vdf')
    const content = await readFile(vdfPath, 'utf-8')
    const parsed = parseVdf(content)

    const root = parsed['libraryfolders'] || parsed['LibraryFolders'] || parsed
    for (const key of Object.keys(root)) {
      const entry = root[key]
      if (typeof entry === 'object' && entry !== null && 'path' in entry) {
        const path = entry['path'] as string
        if (path && !folders.includes(path)) {
          folders.push(path)
        }
      }
    }
  } catch {}

  return folders
}

async function parseAppManifest(filePath: string, libraryPath: string): Promise<DetectedGame | null> {
  try {
    const content = await readFile(filePath, 'utf-8')
    const parsed = parseVdf(content)
    const appState = parsed['AppState'] || parsed

    if (typeof appState !== 'object') return null

    const name = appState['name'] as string
    const installDir = appState['installdir'] as string
    const sizeOnDisk = parseInt(appState['SizeOnDisk'] as string) || 0
    const appId = appState['appid'] as string
    const lastPlayed = parseInt(appState['LastPlayed'] as string) || 0

    if (!name || !installDir) return null

    // Skip tools, SDKs, redistributables
    const lowerName = name.toLowerCase()
    if (
      lowerName.includes('redistributable') ||
      lowerName.includes('directx') ||
      lowerName.includes('vcredist') ||
      lowerName.includes('proton') ||
      lowerName.includes('steamworks') ||
      lowerName.includes('steam linux runtime')
    ) {
      return null
    }

    const gamePath = join(libraryPath, 'steamapps', 'common', installDir)

    return {
      name,
      path: gamePath,
      sizeBytes: sizeOnDisk,
      platform: 'steam',
      drive: getDriveLetter(gamePath),
      appId,
      lastPlayed: lastPlayed > 0 ? lastPlayed * 1000 : undefined
    }
  } catch {
    return null
  }
}

export async function scanSteam(): Promise<DetectedGame[]> {
  const steamPath = await findSteamPath()
  if (!steamPath) return []

  const libraries = await getLibraryFolders(steamPath)
  const games: DetectedGame[] = []

  for (const lib of libraries) {
    try {
      const steamappsPath = join(lib, 'steamapps')
      const files = await readdir(steamappsPath)
      const manifests = files.filter((f) => f.startsWith('appmanifest_') && f.endsWith('.acf'))

      const results = await Promise.all(
        manifests.map((m) => parseAppManifest(join(steamappsPath, m), lib))
      )

      for (const game of results) {
        if (game) games.push(game)
      }
    } catch {}
  }

  return games
}
