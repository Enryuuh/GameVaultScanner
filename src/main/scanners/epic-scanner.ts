import { readFile, readdir, access } from 'fs/promises'
import { join } from 'path'
import { getDriveLetter } from '../utils/size-calculator'
import { calculateFolderSize } from '../utils/size-calculator'
import type { DetectedGame } from '../types'

const EPIC_MANIFESTS_PATH = join(
  process.env.PROGRAMDATA || 'C:\\ProgramData',
  'Epic',
  'EpicGamesLauncher',
  'Data',
  'Manifests'
)

export async function scanEpic(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    await access(EPIC_MANIFESTS_PATH)
    const files = await readdir(EPIC_MANIFESTS_PATH)
    const itemFiles = files.filter((f) => f.endsWith('.item'))

    for (const file of itemFiles) {
      try {
        const content = await readFile(join(EPIC_MANIFESTS_PATH, file), 'utf-8')
        const manifest = JSON.parse(content)

        const name = manifest.DisplayName
        const installPath = manifest.InstallLocation
        const installSize = manifest.InstallSize || 0
        const appId = manifest.CatalogItemId || manifest.AppName

        if (!name || !installPath) continue

        let sizeBytes = installSize
        if (sizeBytes === 0) {
          sizeBytes = await calculateFolderSize(installPath)
        }

        games.push({
          name,
          path: installPath,
          sizeBytes,
          platform: 'epic',
          drive: getDriveLetter(installPath),
          appId
        })
      } catch {}
    }
  } catch {}

  return games
}
