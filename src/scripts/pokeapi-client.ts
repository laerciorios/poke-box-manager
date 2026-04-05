import pLimit from 'p-limit'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'
const CACHE_DIR = join(process.cwd(), '.cache', 'pokeapi')
const CONCURRENCY = 20
const BATCH_DELAY_MS = 100
const MAX_RETRIES = 3

let useCache = true

export function setUseCache(value: boolean) {
  useCache = value
}

function getCachePath(endpoint: string): string {
  const safeName = endpoint.replace(/\//g, '-').replace(/^-/, '')
  return join(CACHE_DIR, `${safeName}.json`)
}

function readCache(endpoint: string): unknown | null {
  if (!useCache) return null
  const path = getCachePath(endpoint)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

function writeCache(endpoint: string, data: unknown): void {
  mkdirSync(CACHE_DIR, { recursive: true })
  const path = getCachePath(endpoint)
  writeFileSync(path, JSON.stringify(data))
}

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<unknown> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        if (attempt === retries) {
          throw new Error(`Failed to fetch ${url}: HTTP ${res.status} after ${retries} attempts`)
        }
        const delay = Math.pow(2, attempt - 1) * 1000
        console.warn(`  Retry ${attempt}/${retries} for ${url} (HTTP ${res.status}), waiting ${delay}ms...`)
        await sleep(delay)
        continue
      }
      return await res.json()
    } catch (err) {
      if (attempt === retries) throw err
      const delay = Math.pow(2, attempt - 1) * 1000
      console.warn(`  Retry ${attempt}/${retries} for ${url}, waiting ${delay}ms...`)
      await sleep(delay)
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts`)
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchEndpoint(endpoint: string): Promise<unknown> {
  const cached = readCache(endpoint)
  if (cached !== null) return cached

  const url = endpoint.startsWith('http') ? endpoint : `${POKEAPI_BASE}/${endpoint}`
  const data = await fetchWithRetry(url)
  writeCache(endpoint, data)
  return data
}

export async function fetchBatched<T>(
  endpoints: string[],
  label: string,
): Promise<T[]> {
  const limit = pLimit(CONCURRENCY)
  const total = endpoints.length
  let completed = 0
  const startTime = Date.now()

  const results = await Promise.all(
    endpoints.map((endpoint) =>
      limit(async () => {
        const data = await fetchEndpoint(endpoint)
        completed++
        if (completed % CONCURRENCY === 0 || completed === total) {
          const elapsed = (Date.now() - startTime) / 1000
          const rate = completed / elapsed
          const remaining = Math.round((total - completed) / rate)
          const pct = Math.round((completed / total) * 100)
          console.log(
            `  [${label}] ${completed}/${total} (${pct}%) — ~${remaining}s remaining`,
          )
        }
        return data as T
      }),
    ),
  )

  // Delay between batch completions to respect rate limits
  await sleep(BATCH_DELAY_MS)

  return results
}
