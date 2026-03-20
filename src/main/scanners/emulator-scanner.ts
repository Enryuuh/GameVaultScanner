import { runPowerShell } from '../utils/powershell'
import { access, readdir, stat } from 'fs/promises'
import { join } from 'path'
import { getDriveLetter, calculateFolderSize } from '../utils/size-calculator'
import type { DetectedGame } from '../types'

interface EmulatorInfo {
  name: string
  exe: string
  romExtensions: string[]
}

const KNOWN_EMULATORS: EmulatorInfo[] = [
  { name: 'RetroArch', exe: 'retroarch.exe', romExtensions: [] },
  { name: 'Dolphin (GameCube/Wii)', exe: 'Dolphin.exe', romExtensions: ['.iso', '.gcm', '.wbfs', '.ciso', '.gcz', '.rvz'] },
  { name: 'PCSX2 (PS2)', exe: 'pcsx2*.exe', romExtensions: ['.iso', '.bin', '.chd'] },
  { name: 'RPCS3 (PS3)', exe: 'rpcs3.exe', romExtensions: ['.iso'] },
  { name: 'PPSSPP (PSP)', exe: 'PPSSPPWindows*.exe', romExtensions: ['.iso', '.cso', '.pbp'] },
  { name: 'Cemu (Wii U)', exe: 'Cemu.exe', romExtensions: ['.wud', '.wux', '.rpx', '.wua'] },
  { name: 'Ryujinx (Switch)', exe: 'Ryujinx.exe', romExtensions: ['.nsp', '.xci', '.nca'] },
  { name: 'DeSmuME (NDS)', exe: 'DeSmuME*.exe', romExtensions: ['.nds', '.srl'] },
  { name: 'mGBA (GBA)', exe: 'mgba*.exe', romExtensions: ['.gba', '.gbc', '.gb'] },
  { name: 'Citra (3DS)', exe: 'citra*.exe', romExtensions: ['.3ds', '.cci', '.cxi'] },
  { name: 'Xenia (Xbox 360)', exe: 'xenia*.exe', romExtensions: ['.iso', '.xex'] }
]

async function findEmulatorPaths(): Promise<string[]> {
  const paths: string[] = []

  try {
    const output = await runPowerShell(`
      $emulatorExes = @('retroarch.exe','Dolphin.exe','pcsx2*.exe','rpcs3.exe','Cemu.exe','Ryujinx.exe')
      $searchPaths = @(
        "$env:LOCALAPPDATA",
        "$env:APPDATA",
        "C:\\Program Files",
        "C:\\Program Files (x86)",
        "$env:USERPROFILE\\Downloads"
      )
      # Also add root of each drive
      Get-PSDrive -PSProvider FileSystem | ForEach-Object {
        $searchPaths += "$($_.Root)Emulators"
        $searchPaths += "$($_.Root)Games\\Emulators"
        $searchPaths += "$($_.Root)RetroArch"
      }
      $searchPaths | Where-Object { Test-Path $_ } | ConvertTo-Json
    `)

    if (output) {
      const raw = JSON.parse(output)
      const items = Array.isArray(raw) ? raw : [raw]
      paths.push(...items.filter(Boolean))
    }
  } catch {}

  return paths
}

async function scanRomFolder(
  folderPath: string,
  extensions: string[]
): Promise<{ count: number; totalSize: number }> {
  let count = 0
  let totalSize = 0

  try {
    const entries = await readdir(folderPath, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = '.' + entry.name.split('.').pop()?.toLowerCase()
        if (extensions.includes(ext)) {
          count++
          try {
            const s = await stat(join(folderPath, entry.name))
            totalSize += s.size
          } catch {}
        }
      } else if (entry.isDirectory()) {
        const sub = await scanRomFolder(join(folderPath, entry.name), extensions)
        count += sub.count
        totalSize += sub.totalSize
      }
    }
  } catch {}

  return { count, totalSize }
}

export async function scanEmulators(): Promise<DetectedGame[]> {
  const games: DetectedGame[] = []
  const searchPaths = await findEmulatorPaths()

  // Detect installed emulators and their ROM directories
  for (const emu of KNOWN_EMULATORS) {
    for (const basePath of searchPaths) {
      try {
        await access(basePath)
        const entries = await readdir(basePath, { withFileTypes: true })

        for (const entry of entries) {
          if (!entry.isDirectory()) continue
          const emuPath = join(basePath, entry.name)

          // Check if this directory contains the emulator
          try {
            const files = await readdir(emuPath)
            const hasExe = files.some((f) => {
              if (emu.exe.includes('*')) {
                const pattern = emu.exe.replace('*', '')
                return f.toLowerCase().includes(pattern.toLowerCase().replace('.exe', ''))
              }
              return f.toLowerCase() === emu.exe.toLowerCase()
            })

            if (hasExe) {
              const sizeBytes = await calculateFolderSize(emuPath)

              games.push({
                name: `${emu.name} (Emulador)`,
                path: emuPath,
                sizeBytes,
                platform: 'emulator',
                drive: getDriveLetter(emuPath)
              })

              // Look for ROMs in common subdirectories
              if (emu.romExtensions.length > 0) {
                const romDirs = ['roms', 'ROMs', 'games', 'Games', 'ISOs', 'isos']
                for (const romDir of romDirs) {
                  const romPath = join(emuPath, romDir)
                  try {
                    await access(romPath)
                    const { count, totalSize } = await scanRomFolder(romPath, emu.romExtensions)
                    if (count > 0) {
                      games.push({
                        name: `ROMs ${emu.name} (${count} archivos)`,
                        path: romPath,
                        sizeBytes: totalSize,
                        platform: 'emulator',
                        drive: getDriveLetter(romPath)
                      })
                    }
                  } catch {}
                }
              }
            }
          } catch {}
        }
      } catch {}
    }
  }

  return games
}
