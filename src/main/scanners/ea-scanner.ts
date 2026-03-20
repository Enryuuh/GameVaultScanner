import { runPowerShell } from '../utils/powershell'
import { readdir, readFile, access } from 'fs/promises'
import { join } from 'path'
import { getDriveLetter, calculateFolderSize } from '../utils/size-calculator'
import type { DetectedGame } from '../types'

const EA_INSTALL_DATA = join(
  process.env.PROGRAMDATA || 'C:\\ProgramData',
  'EA Desktop',
  'InstallData'
)

export async function scanEa(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  // Method 1: EA Desktop XML manifests
  try {
    await access(EA_INSTALL_DATA)
    const files = await readdir(EA_INSTALL_DATA)

    for (const file of files) {
      if (!file.endsWith('.xml')) continue
      try {
        const content = await readFile(join(EA_INSTALL_DATA, file), 'utf-8')

        const nameMatch = content.match(/<DisplayName>(.*?)<\/DisplayName>/i)
        const pathMatch =
          content.match(/<filePath>(.*?)<\/filePath>/i) ||
          content.match(/<installDir>(.*?)<\/installDir>/i)

        if (nameMatch && pathMatch) {
          const installPath = pathMatch[1]
          try {
            await access(installPath)
          } catch {
            continue
          }

          const sizeBytes = await calculateFolderSize(installPath)
          games.push({
            name: nameMatch[1],
            path: installPath,
            sizeBytes,
            platform: 'ea',
            drive: getDriveLetter(installPath)
          })
        }
      } catch {}
    }
  } catch {}

  // Method 2: Registry (EA Desktop + Origin)
  try {
    const output = await runPowerShell(`
      $paths = @(
        'HKLM:\\SOFTWARE\\WOW6432Node\\Electronic Arts\\EA Desktop\\InstallSuccessful',
        'HKLM:\\SOFTWARE\\WOW6432Node\\Origin Games'
      )
      $results = @()
      foreach ($path in $paths) {
        $keys = Get-ChildItem $path -ErrorAction SilentlyContinue
        if ($keys) {
          $keys | ForEach-Object {
            $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
            $results += [PSCustomObject]@{
              Name = $_.PSChildName
              Path = $props.'Install Dir' ?? $props.InstallDir ?? $props.'(default)'
            }
          }
        }
      }
      if ($results.Count -gt 0) { $results | Where-Object { $_.Path } | ConvertTo-Json -Depth 3 }
    `)

    if (output) {
      const raw = JSON.parse(output)
      const items = Array.isArray(raw) ? raw : [raw]
      const existingPaths = new Set(games.map((g) => g.path.toLowerCase()))

      for (const item of items) {
        if (!item.Path || existingPaths.has(item.Path.toLowerCase())) continue

        try {
          await access(item.Path)
        } catch {
          continue
        }

        const sizeBytes = await calculateFolderSize(item.Path)
        games.push({
          name: item.Name || 'EA Game',
          path: item.Path,
          sizeBytes,
          platform: 'ea',
          drive: getDriveLetter(item.Path)
        })
      }
    }
  } catch {}

  return games
}
