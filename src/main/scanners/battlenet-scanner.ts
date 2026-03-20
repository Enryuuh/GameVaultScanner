import { readFile, access, stat } from 'fs/promises'
import { join } from 'path'
import { getDriveLetter, calculateFolderSize } from '../utils/size-calculator'
import type { DetectedGame } from '../types'

const BATTLENET_CONFIG = join(
  process.env.APPDATA || '',
  'Battle.net',
  'Battle.net.config'
)

const CODENAME_MAP: Record<string, string> = {
  prometheus: 'Overwatch 2',
  fenris: 'Diablo IV',
  viper: 'Call of Duty',
  odin: 'Call of Duty: Modern Warfare',
  lazarus: 'Diablo II: Resurrected',
  osi: 'Diablo Immortal',
  rtro: 'Blizzard Arcade Collection',
  w3: 'Warcraft III: Reforged',
  s2: 'StarCraft II',
  hero: 'Heroes of the Storm',
  hs: 'Hearthstone',
  wow: 'World of Warcraft',
  d3: 'Diablo III',
  s1: 'StarCraft: Remastered',
  wlby: 'Crash Bandicoot 4',
  fore: 'Call of Duty: Vanguard',
  zeus: 'Call of Duty: Black Ops Cold War',
  auks: 'Call of Duty: MW II',
  spot: 'Call of Duty: MW III'
}

export async function scanBattleNet(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    await access(BATTLENET_CONFIG)
    const content = await readFile(BATTLENET_CONFIG, 'utf-8')
    const config = JSON.parse(content)

    // Get default install path
    const defaultPath =
      config?.Client?.Install?.DefaultInstallPath || 'C:\\Program Files (x86)'

    // Scan games from config
    const gamesConfig = config?.Games || {}

    for (const [codename, gameData] of Object.entries(gamesConfig)) {
      if (!gameData || typeof gameData !== 'object') continue

      const data = gameData as Record<string, unknown>
      const serverUid = data['ServerUid'] as string | undefined
      const playPath = data['Resumable'] as string | undefined
      const lastPlayed = data['LastPlayed'] as string | undefined

      // Check if the game seems to be installed
      // Look for install path in various possible locations
      let installPath = ''

      // Try specific game path patterns
      const gameName = CODENAME_MAP[codename] || codename
      const possiblePaths = [
        join(defaultPath, gameName),
        join(defaultPath, codename)
      ]

      if (serverUid) {
        // Also check per-game config sections
        const gameConfig = config?.[serverUid]
        if (gameConfig?.['InstallPath']) {
          possiblePaths.unshift(gameConfig['InstallPath'])
        }
      }

      for (const p of possiblePaths) {
        try {
          const s = await stat(p)
          if (s.isDirectory()) {
            installPath = p
            break
          }
        } catch {}
      }

      if (!installPath) continue

      const sizeBytes = await calculateFolderSize(installPath)
      if (sizeBytes === 0) continue

      games.push({
        name: CODENAME_MAP[codename] || codename,
        path: installPath,
        sizeBytes,
        platform: 'battlenet',
        drive: getDriveLetter(installPath),
        appId: codename,
        lastPlayed: lastPlayed ? parseInt(lastPlayed) * 1000 : undefined
      })
    }
  } catch {}

  return games
}
