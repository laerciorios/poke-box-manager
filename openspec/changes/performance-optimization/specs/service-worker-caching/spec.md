## ADDED Requirements

### Requirement: A Workbox Service Worker pre-caches static assets in production
The app SHALL register a Workbox-powered Service Worker in production builds (not development). On installation, it SHALL pre-cache all versioned JS/CSS bundles (via Workbox's `precacheAndRoute`) so repeat visits load entirely from cache.

#### Scenario: Service Worker registers in production
- **WHEN** the production build is loaded in a browser
- **THEN** a Service Worker SHALL be registered at `/sw.js`
- **THEN** the browser's DevTools Application panel SHALL show it as active

#### Scenario: Service Worker does not register in development
- **WHEN** the app runs via `npm run dev`
- **THEN** no Service Worker SHALL be registered
- **THEN** all requests SHALL go to the network as normal

#### Scenario: Precache manifest covers JS and CSS bundles
- **WHEN** the Service Worker installs
- **THEN** it SHALL pre-cache all Next.js-generated JS and CSS files with content-hash filenames
- **THEN** subsequent page loads SHALL be served from cache without network requests

### Requirement: Sprites are cached with StaleWhileRevalidate strategy
Requests for files under `/sprites/` SHALL use the `StaleWhileRevalidate` caching strategy: the Service Worker SHALL respond immediately from cache (if available) and update the cache entry in the background.

#### Scenario: Cached sprite is served instantly on repeat visit
- **WHEN** a sprite has been fetched at least once and the user revisits the app
- **THEN** the sprite SHALL be served from cache without a network round-trip

#### Scenario: Cache is updated in the background
- **WHEN** a sprite is served from cache via StaleWhileRevalidate
- **THEN** the Service Worker SHALL also send a network request to update the cached version

### Requirement: Data JSON chunks are cached with CacheFirst strategy
Requests for Pokémon data JSON files (`/pokemon-gen-*.json`) SHALL use `CacheFirst`: the cache is checked first; only on a miss does the network request fire.

#### Scenario: Cached data chunk is returned without network
- **WHEN** a generation chunk has been loaded before and the Service Worker cache contains it
- **THEN** the app SHALL receive the data from cache immediately without a network request

#### Scenario: Cache miss triggers network fetch and caches the response
- **WHEN** a generation chunk is requested but not yet in cache
- **THEN** the Service Worker SHALL fetch it from the network and store it in cache for future use

### Requirement: Old caches are cleaned up on Service Worker activation
When a new Service Worker version activates, it SHALL delete any cache entries that are no longer part of the current precache manifest.

#### Scenario: Stale bundle cache entries are removed on activation
- **WHEN** a new Service Worker activates after a deploy with new asset hashes
- **THEN** cache entries for old content-hashed bundles SHALL be removed
- **THEN** cache entries for new bundles SHALL be added
