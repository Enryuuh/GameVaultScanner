import { stat, readdir } from 'fs/promises'
import { join } from 'path'

export async function calculateFolderSize(folderPath: string): Promise<number> {
  try {
    let totalSize = 0
    const entries = await readdir(folderPath, { withFileTypes: true })

    const promises = entries.map(async (entry) => {
      const fullPath = join(folderPath, entry.name)
      try {
        if (entry.isFile()) {
          const s = await stat(fullPath)
          return s.size
        } else if (entry.isDirectory()) {
          return calculateFolderSize(fullPath)
        }
      } catch {
        return 0
      }
      return 0
    })

    const sizes = await Promise.all(promises)
    totalSize = sizes.reduce((a, b) => a + b, 0)
    return totalSize
  } catch {
    return 0
  }
}

export function getDriveLetter(filePath: string): string {
  const match = filePath.match(/^([A-Za-z]:)/)
  return match ? match[1].toUpperCase() : 'C:'
}
