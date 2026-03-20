import { execFile } from 'child_process'

export function runPowerShell(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', command],
      { maxBuffer: 50 * 1024 * 1024, windowsHide: true },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`PowerShell error: ${stderr || error.message}`))
        } else {
          resolve(stdout.trim())
        }
      }
    )
  })
}

export async function runPowerShellJSON<T>(command: string): Promise<T> {
  const output = await runPowerShell(`${command} | ConvertTo-Json -Depth 5`)
  if (!output) return [] as unknown as T
  return JSON.parse(output)
}

export async function getFolderSize(folderPath: string): Promise<number> {
  try {
    const escaped = folderPath.replace(/'/g, "''")
    const result = await runPowerShell(
      `(Get-ChildItem '${escaped}' -Recurse -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum`
    )
    return parseInt(result) || 0
  } catch {
    return 0
  }
}
