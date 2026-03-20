/**
 * Parser para archivos Valve Data Format (.vdf / .acf)
 * Formato key-value anidado usado por Steam
 */

type VdfValue = string | VdfObject
interface VdfObject {
  [key: string]: VdfValue
}

export function parseVdf(content: string): VdfObject {
  const result: VdfObject = {}
  const stack: VdfObject[] = [result]
  let currentKey = ''

  const lines = content.split('\n')

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line || line.startsWith('//')) continue

    if (line === '{') {
      const newObj: VdfObject = {}
      stack[stack.length - 1][currentKey] = newObj
      stack.push(newObj)
      continue
    }

    if (line === '}') {
      stack.pop()
      continue
    }

    // Parse "key" "value" or just "key"
    const tokens: string[] = []
    let i = 0
    while (i < line.length) {
      if (line[i] === '"') {
        i++
        let token = ''
        while (i < line.length && line[i] !== '"') {
          if (line[i] === '\\' && i + 1 < line.length) {
            token += line[i + 1]
            i += 2
          } else {
            token += line[i]
            i++
          }
        }
        i++ // skip closing quote
        tokens.push(token)
      } else if (line[i] === '\t' || line[i] === ' ') {
        i++
      } else {
        // Unquoted token
        let token = ''
        while (i < line.length && line[i] !== '\t' && line[i] !== ' ' && line[i] !== '"') {
          token += line[i]
          i++
        }
        if (token) tokens.push(token)
      }
    }

    if (tokens.length === 2) {
      stack[stack.length - 1][tokens[0]] = tokens[1]
    } else if (tokens.length === 1) {
      currentKey = tokens[0]
    }
  }

  return result
}
