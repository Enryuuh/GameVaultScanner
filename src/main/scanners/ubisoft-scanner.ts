import { runPowerShell } from '../utils/powershell'
import { getDriveLetter, calculateFolderSize } from '../utils/size-calculator'
import { access } from 'fs/promises'
import type { DetectedGame } from '../types'

export async function scanUbisoft(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    const output = await runPowerShell(`
      $keys = Get-ChildItem 'HKLM:\\SOFTWARE\\WOW6432Node\\Ubisoft\\Launcher\\Installs' -ErrorAction SilentlyContinue
      if ($keys) {
        $keys | ForEach-Object {
          $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
          [PSCustomObject]@{
            InstallDir = $props.InstallDir
            GameId = $_.PSChildName
          }
        } | Where-Object { $_.InstallDir } | ConvertTo-Json -Depth 3
      }
    `)

    if (!output) return games

    const raw = JSON.parse(output)
    const items = Array.isArray(raw) ? raw : [raw]

    for (const item of items) {
      if (!item.InstallDir) continue

      try {
        await access(item.InstallDir)
      } catch {
        continue
      }

      // Get folder name as game name
      const parts = item.InstallDir.replace(/[\\/]+$/, '').split(/[\\/]/)
      const name = parts[parts.length - 1] || 'Ubisoft Game'

      const sizeBytes = await calculateFolderSize(item.InstallDir)

      games.push({
        name,
        path: item.InstallDir,
        sizeBytes,
        platform: 'ubisoft',
        drive: getDriveLetter(item.InstallDir),
        appId: item.GameId
      })
    }
  } catch {}

  return games
}
