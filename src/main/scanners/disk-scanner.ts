import { runPowerShell } from '../utils/powershell'
import type { DiskInfo } from '../types'

export async function scanDisks(): Promise<DiskInfo[]> {
  const output = await runPowerShell(`
    Get-PSDrive -PSProvider FileSystem | Where-Object { $_.Used -ne $null -or $_.Free -ne $null } | ForEach-Object {
      [PSCustomObject]@{
        Drive = $_.Root.Substring(0,2)
        Label = $_.Description
        Used = [long]$_.Used
        Free = [long]$_.Free
      }
    } | ConvertTo-Json -Depth 3
  `)

  if (!output) return []

  const raw = JSON.parse(output)
  const items = Array.isArray(raw) ? raw : [raw]

  return items.map((d) => ({
    drive: d.Drive.toUpperCase(),
    label: d.Label || d.Drive,
    totalBytes: (d.Used || 0) + (d.Free || 0),
    usedBytes: d.Used || 0,
    freeBytes: d.Free || 0,
    gamesBytes: 0,
    gameCount: 0
  }))
}
