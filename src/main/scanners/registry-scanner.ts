import { runPowerShell } from '../utils/powershell'
import { getDriveLetter } from '../utils/size-calculator'
import { access } from 'fs/promises'
import type { DetectedGame } from '../types'

// Publishers/names that are NOT games
const EXCLUDE_PUBLISHERS = [
  'microsoft', 'nvidia', 'intel', 'amd', 'realtek', 'google', 'mozilla',
  'adobe', 'oracle', 'java', 'python', 'node', 'git', 'visual studio',
  'vmware', 'virtualbox', 'docker', 'notepad', 'vlc', 'winrar', '7-zip',
  'discord', 'slack', 'zoom', 'teams', 'obs', 'audacity', 'gimp',
  'libreoffice', 'openoffice', 'ccleaner', 'malwarebytes', 'avast',
  'kaspersky', 'norton', 'mcafee', 'dell', 'hp', 'lenovo', 'asus',
  'logitech', 'corsair', 'razer', 'steelseries', 'elgato',
  'redistributable', 'runtime', 'framework', 'driver', 'update',
  'service pack', 'hotfix', 'kb\\d', 'directx', 'vcredist', 'msvc',
  'dotnet', '.net', 'windows sdk', 'android', 'cmake', 'rust', 'cargo'
]

const EXCLUDE_PATTERN = new RegExp(EXCLUDE_PUBLISHERS.join('|'), 'i')

// Known game publishers
const GAME_PUBLISHERS = [
  'steam', 'valve', 'epic games', 'blizzard', 'activision', 'ubisoft',
  'electronic arts', 'ea ', 'bethesda', 'cd projekt', 'rockstar',
  'square enix', 'bandai namco', 'capcom', 'sega', 'konami',
  'warner bros', 'wb games', '2k games', 'take-two', 'thq',
  'paradox', 'devolver', 'team17', 'focus', 'deep silver',
  'techland', 'fromsoftware', 'riot games', 'mihoyo', 'hoyoverse'
]

const GAME_PUBLISHER_PATTERN = new RegExp(GAME_PUBLISHERS.join('|'), 'i')

export async function scanRegistry(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []

  try {
    const output = await runPowerShell(`
      $paths = @(
        'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
        'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
        'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
      )
      $results = @()
      foreach ($regPath in $paths) {
        Get-ChildItem $regPath -ErrorAction SilentlyContinue | ForEach-Object {
          $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
          if ($props.DisplayName -and $props.InstallLocation) {
            $results += [PSCustomObject]@{
              Name = $props.DisplayName
              Path = $props.InstallLocation
              Publisher = $props.Publisher
              Size = $props.EstimatedSize
            }
          }
        }
      }
      if ($results.Count -gt 0) { $results | ConvertTo-Json -Depth 3 }
    `)

    if (!output) return games

    const raw = JSON.parse(output)
    const items = Array.isArray(raw) ? raw : [raw]

    for (const item of items) {
      if (!item.Name || !item.Path) continue

      // Filter: skip non-games
      const nameAndPublisher = `${item.Name} ${item.Publisher || ''}`
      if (EXCLUDE_PATTERN.test(nameAndPublisher)) continue

      // Check if publisher is a known game publisher OR size is large enough
      const estimatedSize = (item.Size || 0) * 1024 // KB to bytes
      const isFromGamePublisher = GAME_PUBLISHER_PATTERN.test(item.Publisher || '')

      if (!isFromGamePublisher && estimatedSize < 500 * 1024 * 1024) continue // Skip < 500MB non-game-publisher

      try {
        await access(item.Path)
      } catch {
        continue
      }

      games.push({
        name: item.Name,
        path: item.Path,
        sizeBytes: estimatedSize,
        platform: 'other',
        drive: getDriveLetter(item.Path)
      })
    }
  } catch {}

  return games
}
