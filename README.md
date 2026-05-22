# PokéBox — Poke Box Manager

Companion offline-first para Pokémon Home. Construído com Next.js 16, React 19,
Tailwind 4 e Framer Motion. Tudo roda no navegador, sem backend, sem login.

> **Versão 2.0** — Reescrita completa da camada de UI em 2026-05-21. A camada
> de dados (pipeline de fetch da PokéAPI, stores Zustand, engines, tipos)
> foi preservada. Veja [`docs/REWRITE.md`](docs/REWRITE.md) para o plano e
> as fases.

## O que é

PokéBox é uma superfície de planejamento para colecionadores de Pokémon. A
ideia central é ser uma alternativa ao Pokémon Home para:

- Organizar boxes 6×5 (30 slots cada) antes de tocá-las no jogo.
- Acompanhar progresso de Pokédex com formas, regionais e variantes.
- Salvar predefinições de organização (por geração, por tipo, etc.).
- Identificar Pokémon faltantes e shinies a caçar.
- Visualizar estatísticas com heatmaps e milestones.

Tudo roda no navegador. Os dados ficam em IndexedDB. Não há conta, sync ou
telemetria.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + tokens OKLCH (light / dark)
- **State**: Zustand persistido em IndexedDB (`idb-keyval`)
- **Motion**: `motion/react` (Framer Motion v11) — respeita `prefers-reduced-motion`
- **i18n**: `next-intl` (pt-BR default, en)
- **DnD**: `@dnd-kit` (Fase 2)
- **Data**: pipeline de fetch da PokéAPI em build time, gera JSON estático

## Como rodar

Pré-requisitos: Node 20+, npm 10+.

```bash
npm install
npm run dev          # http://localhost:3000
```

Para um build de produção (re-fetcha dados da PokéAPI):

```bash
npm run build
npm run start
```

Para validar:

```bash
npm run lint
npm run format
```

## Pipeline de dados

```bash
npm run fetch-data       # re-fetch da PokéAPI (cache em .cache/)
npm run validate-data    # valida os JSONs gerados
npm run generate-locales # gera nomes localizados
```

## Estrutura

```
src/
  app/                # rotas e layouts (App Router)
    [locale]/        # páginas com prefixo de locale
  components/
    ui/              # primitives (Button, Card, Badge, Input, ProgressRing)
    motion/          # FadeIn, Reveal, Stagger, CountUp
    layout/          # AppShell, Sidebar, Header, MobileNav, ThemeProvider, ComingSoon
    home/            # LandingHero, FeatureGrid, HowItWorks, CallToAction, DashboardOverview
    boxes/           # BoxView, BoxSlot
    pokemon/         # Sprite, TypeChip, PokemonPicker
  data/              # JSONs gerados pelo fetch script
  hooks/             # hooks reutilizáveis
  i18n/              # routing + messages pt-BR/en
  lib/               # engines, utils, type-colors
  scripts/           # pipeline de fetch da PokéAPI
  stores/            # Zustand persistido em IndexedDB
  types/             # domain types
docs/
  REWRITE.md         # plano da reescrita, fases, decisões arquiteturais
```

## Status por fase

A reescrita está dividida em fases — esta entrega corresponde à **Fase 4**.

- ✅ **Fase 1**: design system novo, nova Home (landing + dashboard), Boxes
  básico, Pokédex básico, Settings básico, stubs de Stats/Presets/Missing
- ✅ **Fase 2**: DnD com `@dnd-kit` (paridade de teclado, anúncios
  localizados, DragOverlay), context menu por slot, MoveTo dialog, AutoFill,
  BoxColorPicker, FloatingActionBar (seleção múltipla), navegação por
  teclado entre boxes; Pokédex virtualizada (`@tanstack/react-virtual`),
  filtros por tipo / categoria / status / geração, modo tabela ↔ grade,
  modal de detalhes com formas e linha evolutiva; Settings com 12 variation
  toggles, picker de gerações, sprite style com preview, toggles de exibição,
  export / import (merge ou replace), backup reminder global
- ✅ **Fase 3**: Stats com Recharts (hero ring + barras por geração + heatmap
  de boxes clicável com deep-link `/boxes#<id>` + grid por tipo + milestones
  + aba shiny condicional); History panel global (Cmd+H, Cmd+Z, undo por
  entrada); Tags (CRUD em Settings, picker via slot context menu, filtros
  na página Boxes); Missing analysis (filtros + virtualização + export
  JSON/CSV + sugestões de shinies); Presets (lista com built-ins + user,
  editor com regras DnD + preview, import/export JSON)
- ✅ **Fase 4**: PWA com manifest + service worker manual (sprites SWR,
  estáticos cache-first, HTML network-first) e botão quieto de update no
  Header; code splitting agressivo via `next/dynamic` (Recharts, PokedexDetails,
  PresetEditor, BackupPanel, ShortcutsOverlay, CommandPalette); toaster
  minimalista canto inferior direito; `⌘K` busca global; `?` painel de
  atalhos; `useNavDirection()` para page transitions direcionais; focus trap
  em todos os Dialogs; `@axe-core/react` em dev; A11y subiu para **100** em
  todas as rotas (Lighthouse mobile)

Detalhes e métricas em [`docs/REWRITE.md`](docs/REWRITE.md).

## Offline & PWA

A partir da Fase 4 o app é uma PWA real:

- **Manifest**: `public/manifest.webmanifest` com ícones 192/512 e
  `display: standalone`. Em mobile/desktop suportados, dá pra "Instalar
  PokéBox" e abrir como app.
- **Service worker** (`public/sw.js`): cache stale-while-revalidate para
  sprites do GitHub, cache-first para `_next/static/*`, network-first para
  HTML. Após o primeiro load, o app funciona **100% offline** (incluindo
  troca de páginas, leitura/escrita em IndexedDB).
- **Atualizações**: quando uma nova versão é instalada, um ícone de download
  discreto aparece no Header. Clicar nele chama `SKIP_WAITING` no SW e
  recarrega — sem toast, sem berro.

## Acessibilidade

Compromissos:

- WCAG 2.2 AA como alvo.
- `prefers-reduced-motion` respeitado em toda animação.
- Focus rings visíveis em todos os elementos interativos.
- Tipo e geração nunca dependem só de cor (sempre par com glyph/texto).
- Keyboard parity em DnD (Fase 2, via `@dnd-kit/accessibility`).

## Licença

Sem licença definida.
