import { runPowerShell } from '../utils/powershell'
import { getDriveLetter, calculateFolderSize } from '../utils/size-calculator'
import { access } from 'fs/promises'
import type { DetectedGame } from '../types'

export async function scanGog(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    const output = await runPowerShell(`
      $keys = Get-ChildItem 'HKLM:\\SOFTWARE\\WOW6432Node\\GOG.com\\Games' -ErrorAction SilentlyContinue
      if ($keys) {
        $keys | ForEach-Object {
          $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
          [PSCustomObject]@{
            Name = $props.gameName
            Path = $props.path
            GameID = $props.gameID
          }
        } | Where-Object { $_.Name -and $_.Path } | ConvertTo-Json -Depth 3
      }
    `)

    if (!output) return games

    const raw = JSON.parse(output)
    const items = Array.isArray(raw) ? raw : [raw]

    for (const item of items) {
      if (!item.Name || !item.Path) continue

      try {
        await access(item.Path)
      } catch {
        continue
      }

      const sizeBytes = await calculateFolderSize(item.Path)

      games.push({
        name: item.Name,
        path: item.Path,
        sizeBytes,
        platform: 'gog',
        drive: getDriveLetter(item.Path),
        appId: item.GameID?.toString()
      })
    }
  } catch {}

  return games
}
