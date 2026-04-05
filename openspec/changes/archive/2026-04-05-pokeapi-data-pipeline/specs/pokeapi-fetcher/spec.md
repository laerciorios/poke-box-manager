## ADDED Requirements

### Requirement: Batched HTTP client for PokeAPI
The system SHALL provide an HTTP client at `src/scripts/pokeapi-client.ts` that fetches data from PokeAPI with a concurrency limit of 20 simultaneous requests and a 100ms delay between batches.

#### Scenario: Concurrent request limiting
- **WHEN** fetching data for 100 Pokemon species
- **THEN** the client SHALL execute at most 20 requests concurrently
- **THEN** the client SHALL wait 100ms between completing one batch and starting the next

#### Scenario: Successful data fetch
- **WHEN** fetching `/api/v2/pokemon-species/25`
- **THEN** the client SHALL return the parsed JSON response from PokeAPI

### Requirement: Retry with exponential backoff
The client SHALL retry failed requests up to 3 times with exponential backoff (1s, 2s, 4s). After 3 failures, the request SHALL throw an error with the endpoint URL and HTTP status.

#### Scenario: Transient failure recovery
- **WHEN** a request fails with a 429 (rate limited) or 5xx status
- **THEN** the client SHALL retry after 1 second
- **THEN** on second failure, retry after 2 seconds
- **THEN** on third failure, retry after 4 seconds

#### Scenario: Permanent failure
- **WHEN** a request fails 3 times consecutively
- **THEN** the client SHALL throw an error containing the endpoint URL and last HTTP status code

### Requirement: Local disk cache
The client SHALL cache raw API responses to `.cache/pokeapi/` as individual JSON files. Cached responses SHALL be used instead of making network requests. The cache directory SHALL be in `.gitignore`.

#### Scenario: Cache hit
- **WHEN** fetching an endpoint that has a cached response in `.cache/pokeapi/`
- **THEN** the client SHALL return the cached data without making a network request

#### Scenario: Cache miss
- **WHEN** fetching an endpoint with no cached response
- **THEN** the client SHALL make a network request and save the response to `.cache/pokeapi/`

#### Scenario: Cache invalidation
- **WHEN** the user runs the fetch script with a `--no-cache` flag
- **THEN** the client SHALL ignore existing cache and re-fetch all data

### Requirement: Progress reporting
The client SHALL log progress to stdout showing: current batch number, total items, and estimated time remaining.

#### Scenario: Progress output during fetch
- **WHEN** fetching data for 1000+ Pokemon
- **THEN** the client SHALL log progress messages showing completion percentage and items processed

### Requirement: PokeAPI endpoints coverage
The client SHALL support fetching from all endpoints defined in spec section 2.3:
- `/api/v2/pokemon-species/{id}` — species data
- `/api/v2/pokemon/{id}` — Pokemon data (sprites, types)
- `/api/v2/pokemon-form/{id}` — form details
- `/api/v2/pokedex/1` — National Dex
- `/api/v2/generation/{id}` — generations
- `/api/v2/version-group/{id}` — version groups
- `/api/v2/version/{id}` — individual games
- `/api/v2/type/{id}` — types
- `/api/v2/evolution-chain/{id}` — evolution chains

#### Scenario: All required endpoints fetchable
- **WHEN** the pipeline runs
- **THEN** the client SHALL successfully fetch data from all listed endpoints
