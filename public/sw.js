const CACHE_VERSION = 'v1'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const SPRITE_CACHE = `sprites-${CACHE_VERSION}`
const DATA_CACHE = `data-${CACHE_VERSION}`

const SPRITE_ORIGIN = 'https://raw.githubusercontent.com'
const STATIC_EXTENSIONS = ['.js', '.css', '.woff2', '.woff', '.ico', '.svg']

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== SPRITE_CACHE && k !== DATA_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Sprites from GitHub (PokeAPI) — StaleWhileRevalidate
  if (url.origin === SPRITE_ORIGIN) {
    event.respondWith(staleWhileRevalidate(SPRITE_CACHE, request))
    return
  }

  // Static Next.js assets and data JSON — CacheFirst
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext))
  const isDataJson =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.match(/\/pokemon(-gen-\d+|-manifest)?\.json$/)

  if (isStatic || isDataJson) {
    event.respondWith(cacheFirst(STATIC_CACHE, request))
    return
  }

  // HTML navigation — NetworkFirst (always fresh)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(STATIC_CACHE, request))
    return
  }
})

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  }).catch(() => null)
  return cached ?? (await networkFetch) ?? Response.error()
}

async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function networkFirst(cacheName, request) {
  const cache = await caches.open(cacheName)
  try {
    const response = await fetch(request)
    if (response.ok) cache.put(request, response.clone())
    return response
  } catch {
    const cached = await cache.match(request)
    return cached ?? Response.error()
  }
}
