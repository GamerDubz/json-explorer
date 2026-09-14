export interface JsonMetrics {
  bytes: number
  totalKeys: number
  maxDepth: number
  isArray: boolean
  count: number
}

export interface ParsedJson {
  data: unknown
  error: string | null
  metrics: JsonMetrics
}

function isContainer(value: unknown): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === 'object'
}

/** Parse raw JSON text and compute structural stats used by the metrics rail. */
export function parseJsonSource(rawJson: string): ParsedJson {
  const bytes = new Blob([rawJson]).size

  try {
    const data = JSON.parse(rawJson) as unknown

    let totalKeys = 0
    let maxDepth = 0

    const walk = (value: unknown, depth: number) => {
      maxDepth = Math.max(maxDepth, depth)
      if (isContainer(value)) {
        const keys = Object.keys(value)
        totalKeys += keys.length
        for (const key of keys) {
          walk((value as Record<string, unknown>)[key], depth + 1)
        }
      }
    }
    walk(data, 1)

    return {
      data,
      error: null,
      metrics: {
        bytes,
        totalKeys,
        maxDepth,
        isArray: Array.isArray(data),
        count: isContainer(data) ? Object.keys(data).length : 0,
      },
    }
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Invalid JSON',
      metrics: { bytes, totalKeys: 0, maxDepth: 0, isArray: false, count: 0 },
    }
  }
}

/** Every container path in the tree, used to drive "collapse all". */
export function collectContainerPaths(value: unknown, currentPath = '$'): Set<string> {
  const paths = new Set<string>()

  const walk = (val: unknown, path: string) => {
    if (isContainer(val)) {
      paths.add(path)
      const isArr = Array.isArray(val)
      Object.keys(val).forEach((key) => {
        const nextPath = isArr ? `${path}[${key}]` : `${path}.${key}`
        walk((val as Record<string, unknown>)[key], nextPath)
      })
    }
  }
  walk(value, currentPath)
  return paths
}

/** Strip the leading `$` / `$.` root marker so copied paths read cleanly. */
export function displayPath(path: string): string {
  return path.replace(/^\$\.?/, '') || '$'
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}
