import { runPowerShell } from '../utils/powershell'
import { getDriveLetter } from '../utils/size-calculator'
import type { DetectedGame } from '../types'

export async function scanXbox(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    const output = await runPowerShell(`
      Get-AppxPackage | Where-Object {
        $_.SignatureKind -eq 'Store' -and
        $_.IsFramework -eq $false -and
        $_.InstallLocation -and
        $_.Name -notmatch 'Microsoft\\.|Windows\\.|NVIDIA|Realtek|Intel|AMD|Dell|HP|Lenovo|Dolby|Cortana|Xbox(?!Game)|MSTeams|OneDrive|Office|Edge|Bing|Skype'
      } | ForEach-Object {
        $size = 0
        try {
          $size = [long](Get-ChildItem $_.InstallLocation -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
        } catch {}
        [PSCustomObject]@{
          Name = $_.Name.Split('.')[-1]
          DisplayName = (Get-AppxPackageManifest $_  -ErrorAction SilentlyContinue).Package.Properties.DisplayName
          Path = $_.InstallLocation
          Size = $size
          PackageFullName = $_.PackageFullName
        }
      } | Where-Object { $_.Size -gt 100000000 } | ConvertTo-Json -Depth 3
    `)

    if (!output) return games

    const raw = JSON.parse(output)
    const items = Array.isArray(raw) ? raw : [raw]

    for (const item of items) {
      const name = item.DisplayName || item.Name || 'Unknown Xbox Game'
      if (!item.Path) continue

      games.push({
        name,
        path: item.Path,
        sizeBytes: item.Size || 0,
        platform: 'xbox',
        drive: getDriveLetter(item.Path),
        appId: item.PackageFullName
      })
    }
  } catch {}

  return games
}
