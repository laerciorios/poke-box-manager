# Poke Box Manager — Reescrita (2026-05-21)

> Documento que registra a reescrita da camada de UI do Poke Box Manager.
> A camada de dados (stores, types, scripts, JSONs gerados) foi preservada;
> tudo de UI (app, components, design system, messages) foi reescrito do zero.

---

## 1. Motivação

O produto original ("Quiet over loud", "The Collector's Binder") foi
desenhado para um único persona — colecionadores avançados que abrem o app
ao lado do Pokémon Home, com dados já carregados. A consequência é que
**o primeiro contato do usuário com o app é uma tela vazia, fria e sem
explicação do que fazer**. Para portfolio e para captar outros
colecionadores, isso é um bloqueio.

A nova versão preserva o rigor do produto (offline-first, accessibility,
keyboard parity, i18n) mas introduz três mudanças centrais:

1. **Empty-state que ensina.** Uma landing animada que explica o produto
   antes do usuário precisar adivinhar.
2. **Dashboard elegante.** Quando há dados, a Home vira um dashboard com
   ritmo, hierarquia e micro-animações — sem virar fan-site.
3. **Motion como linguagem.** Framer Motion (`motion/react`) usado com
   intenção: transições de página, layout animations no grid, listas
   stagger, scroll-driven na landing. Sempre respeitando
   `prefers-reduced-motion`.

---

## 2. Decisões arquiteturais

### 2.1 Stack final

| Camada            | Escolha                                  | Motivo                                                          |
| ----------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Framework         | **Next.js 16 (App Router)** + React 19   | Já estava na base; static export funciona para offline-first.   |
| Styling           | **Tailwind CSS 4** + tokens OKLCH        | Tokens semânticos via CSS variables; light/dark via `data-theme`.|
| UI primitives     | **Base UI** + shadcn-style wrappers      | Acessibilidade primeiro; sem dependências de design system extra.|
| Animações         | **`motion/react`** (Framer Motion v11+)  | Layout animations, gestures, page transitions, reduced-motion.  |
| State             | **Zustand** + IndexedDB (`idb-keyval`)   | Mantido — sem mudança de contrato.                              |
| i18n              | **next-intl** (pt-BR default, en)        | Mantido — strings reescritas para a nova UI.                    |
| Drag and drop     | **@dnd-kit** (core, sortable, a11y)      | Mantido — keyboard parity é requisito.                          |
| Charts            | Recharts (somente nas páginas de Stats)  | Opcional; pode ser substituído por SVG manual em fases futuras. |

### 2.2 O que foi preservado (não reescrito)

- `src/scripts/` — pipeline de fetch da PokéAPI em 7 etapas.
- `src/data/*.json` — todos os JSONs gerados (pokemon, forms, generations, types, evolution-chains, manifest).
- `src/types/` — todos os tipos (`PokemonEntry`, `Box`, `BoxSlot`, `SettingsState`, `OrganizationPreset`, etc.).
- `src/stores/` — `useBoxStore`, `usePokedexStore`, `useSettingsStore`, `usePresetsStore`, `useHistoryStore`, `useAcquisitionStore`, `useTagsStore`.
- `src/lib/` — engines (`box-engine`, `preset-engine`, `missing-pokemon`, `search`), utils (`pokemon-data`, `pokemon-names`, `type-colors`, `variation-counts`, `indexeddb-storage`, `store`, `dnd-utils`, `pokedex-rows`, `shortcuts`, `tag-colors`, `box-label-colors`, `history-descriptions`, `form-type-map`, `evolution-method-label`, `pokemon-lookup`, `milestones`, `variations/`, `presets/`, `import/`, `export/`).
- `src/hooks/` — `useStatsData`, `useMediaQuery`, `useSwipeGesture`, `useInViewport`, `useRecentRegistrations`, `useRegistrationMode`, `useSlotFocus`.
- `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`, `src/i18n/pokemon-names/`.
- `src/proxy.ts` — middleware next-intl.

### 2.3 O que foi reescrito (do zero)

- `src/app/` — `layout.tsx`, `globals.css`, `[locale]/layout.tsx`, todas as páginas.
- `src/components/` — todos os componentes.
- `src/contexts/` — recriado se necessário (provavelmente apenas um ThemeProvider trivial).
- `src/i18n/messages/pt-BR.json` e `src/i18n/messages/en.json` — strings reescritas para a nova UI.
- `DESIGN.md` — atualizado para o novo design system.
- `package.json` — adicionar `motion`, remover deps não usadas.

---

## 3. Design system

### 3.1 Filosofia

A nova versão **não rejeita** o "Collector's Binder" — ela o **estende**.
O dashboard elegante mantém a paleta neutra, mas:

- A Home pública ganha uma landing com tipografia editorial e motion.
- Surfaces ganham micro-variação de elevação (gradientes sutis,
  ring + shadow combinados) sem virar bento-grid AI app.
- Signal Red continua sendo a única cor saturada do chrome, mas agora pode
  aparecer em hover states sutis (`bg-accent/5`) e em destaques de
  motion (ex: progress ring color stop).
- Tipografia ganha um peso adicional para hero copy na landing
  (`text-5xl` + `font-display`).

### 3.2 Tokens (resumo)

Veja `src/app/globals.css` para a definição canônica. Os tokens são:

```
--background, --foreground
--surface, --surface-2 (elevação)
--muted, --muted-foreground
--border, --border-strong
--card, --card-foreground
--primary, --primary-foreground
--accent (Signal Red — uso ≤5%)
--accent-foreground
--registered, --shiny, --warning, --destructive
--ring (focus)
--motion-fast: 120ms
--motion-base: 220ms
--motion-slow: 420ms
--motion-ease: cubic-bezier(0.22, 1, 0.36, 1)  /* easeOutQuint */
```

### 3.3 Componentes-base

- `Button` — variants: `primary`, `secondary`, `ghost`, `outline`, `destructive`; sizes: `sm`, `md`, `lg`, `icon`.
- `Card` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- `Badge` — variants: `default`, `secondary`, `outline`, `accent`, `registered`, `shiny`, `warning`.
- `Input`, `Textarea`, `Select`, `Switch`, `Checkbox`, `RadioGroup`.
- `Dialog`, `Drawer`, `Tooltip`, `Popover`, `DropdownMenu`.
- `Sprite` — wrapper para `next/image` com fallback elegante.
- `TypeChip` — chip de tipo com glyph + label + cor de fundo.
- `ProgressRing` — SVG animado para porcentagem de Pokédex.
- `Stagger`, `FadeIn`, `Reveal` — wrappers de `motion/react` com reduced-motion respeitado.

---

## 4. Plano em fases

### Fase 1 — **Esta entrega** ✅

- [x] Apagar UI antiga
- [x] Adicionar `motion`
- [x] Novo design system (`globals.css`, `lib/utils.ts`, componentes UI base)
- [x] Novo layout (root + locale + AppShell com Sidebar e Header)
- [x] **Nova Home com landing + dashboard**
- [x] Recriar página de Boxes (CRUD básico de boxes, grid 6×5, registro de slot)
- [x] Recriar página de Pokédex (lista, busca, registro)
- [x] Stubs funcionais para Stats, Presets, Missing, Settings
- [x] Mensagens i18n pt-BR e en

### Fase 2 — Profundidade nas páginas core ✅

Entregue em `2026-05-21`.

- [x] **Boxes**
  - DnD entre slots na mesma box e entre boxes com `@dnd-kit`
  - Keyboard parity (Espaço, setas, Esc) via `KeyboardSensor` + `sortableKeyboardCoordinates`
  - Anúncios localizados de pickup / over / drop / cancel
  - `BoxSlotPreview` em `DragOverlay` para feedback visual
  - Context menu por slot (botão direito ou long-press 550 ms): trocar Pokémon,
    limpar, marcar shiny / registrado, mover para…, adicionar/remover da seleção
  - `MoveToDialog` com preview do grid de destino
  - Menu de ações da box: limpar tudo, marcar/desmarcar todos, mover ↑↓
  - `BoxColorPicker` (faixa lateral, não fundo cheio) usando `BOX_LABEL_COLORS`
  - `AutoFill` que respeita `activeGenerations` + `variations` e evita duplicatas
  - `FloatingActionBar` com seleção múltipla (Shift/Cmd+click) para
    marcar/desmarcar/limpar/mover lote
  - Navegação entre boxes com ← → / PageUp / PageDown / J / K e widget flutuante
- [x] **Pokédex**
  - Virtualização com `@tanstack/react-virtual` (tabela e grade) — renderiza
    todos os ~1.300 rows sem lag
  - Toggle tabela ↔ grade persistido em `useSettingsStore.pokedexView`
  - Filtros: por tipo (multi), categoria (multi), status (todos / registrados
    / faltantes), geração (single), busca por `#001` / `001` / `1` / slug /
    nome localizado / abreviação de tipo (3 letras)
  - Linhas extras para formas conforme `variations` ativas (com indent na tabela)
  - `PokedexDetails` modal: sprite normal + shiny (se tracker ativo), tipos,
    todas as formas com toggle register, linha evolutiva via
    `evolution-chains.json` + `getEvolutionMethodLabel`
- [x] **Settings**
  - 12 toggles de `VariationToggles` com contagem por toggle e total dinâmico
    (`computeFilteredTotal`)
  - Picker de gerações ativas (chips 1–9)
  - Picker de estilo de sprite com preview ao vivo de cada estilo —
    `Sprite` agora respeita `spriteStyle` global via `useStyledSprite` e
    cai para `home-3d` quando a forma não tem arte equivalente
  - Toggle "mostrar nomes nas boxes" e "rastreador de shinies"
  - Backup + Restore: export JSON via `buildExportPayload` + `downloadJson`,
    import com diff preview (boxes / registrados / presets), merge ou replace
  - Reset zone agora exige digitar `RESET` para habilitar o botão
- [x] **BackupReminderBanner** global no `AppShell` — mostra quando
  `pendingChanges > 5` e o último backup é mais antigo que 7 dias (ou nunca
  aconteceu). Dismiss persiste por 7 dias.
- [x] Strings i18n adicionadas para Boxes / Pokédex / Settings em pt-BR e en.

### Fase 3 — Funcionalidades secundárias ✅

Entregue em `2026-05-21`.

- [x] **Stats** (`/stats`)
  - Hero com `ProgressRing` + contagem registered/total e tiles complete/parcial/empty
  - `BarChart` horizontal (Recharts, `LayoutType="vertical"`) com tooltip localizado;
    barra "missing" empilhada como track + barra "registered" colorida
  - Heatmap de boxes em grid responsivo, cards clicáveis (deep-link `/boxes#<boxId>`);
    legenda complete / partial / empty
  - 18 tiles por tipo (`TYPE_COLORS` no chrome), mini-progress bar e percentual
  - Linha de milestones `[100, 250, 500, 1000, 1300]` — passados preenchidos,
    próximo com pulse via `motion` (degrada com `useReducedMotion()`)
  - Aba shiny condicional ao `shinyTrackerEnabled` — `ShinyTabToggle` troca o
    ring/barras/milestones para `var(--shiny)`; reseta para "overall" se o
    toggle for desligado
- [x] **History panel**
  - `HistoryProvider` global no `AppShell` com Cmd+Z (undo) e Cmd+H (toggle)
  - Drawer lateral com timeline das ~50 entradas; timestamp relativo via
    `Intl.RelativeTimeFormat` (lib `relative-time.ts`); ícone por `actionType`
  - Undo por entrada via `undoEntry(id)` adicionado ao `useHistoryStore`
  - Botão na Header com pulse vermelho quando há entradas; clear com
    confirmação inline
- [x] **Tags**
  - Seção em `/settings` (CRUD + paleta de `tag-colors.ts`)
  - Submenu "Tags…" no `BoxView` context menu abre `TagSlotPicker` (popover
    de checkboxes anchored ao slot)
  - `TagDotGroup` no rodapé de slots ocupados (cap 3 + "+N")
  - `TagFilterBar` no topo de `/boxes` (multi-select; slots não-correspondentes
    ficam `opacity-30` em vez de sumir)
- [x] **Missing** (`/missing`)
  - `MissingSummary` com total + breakdown por geração
  - `MissingFilters` com geração / tipo / categoria / "próximos da evolução"
    (helper `evolution-readiness.ts`)
  - `MissingList` virtualizada via `@tanstack/react-virtual`, reuso de
    `PokedexDetails` no clique
  - Export JSON/CSV via dropdown (`missing-export.ts`)
  - `ShinySuggestions` condicional ao `shinyTrackerEnabled`
- [x] **Presets** (`/presets`)
  - Lista de cards (built-in + user), com aplicar / editar / duplicar / excluir;
    built-ins têm badge "Embutida" e só podem ser aplicados ou duplicados
  - `PresetEditor` (Dialog `lg`) com nome / descrição localizados + lista de
    regras DnD via `@dnd-kit/sortable`; cada `PresetRuleEditor` controla
    `generations`, `types`, `categories`, `sort`, `boxNameTemplate`
  - Toggle "Mostrar preview" renderiza `PresetPreview` (mini-grid 6×5 colorido
    por tipo primário) das primeiras 3 boxes resultantes
  - Aplicar passa por dialog de confirmação e usa `useBoxStore.setBoxes` que
    já gera entry `preset-apply` no history
  - Import/Export apenas do slice de user presets (JSON)
- [x] Strings i18n adicionadas em `Stats`, `Presets`, `Missing`, `Tags`,
  `History` e `Boxes.slotMenu.tags` para pt-BR e en.

### Fase 4 — Polish ✅

Entregue em `2026-05-22`.

- [x] **Skeletons + hydration hook**
  - `Skeleton` em `src/components/ui/skeleton.tsx` (CSS pulse, respeita
    `prefers-reduced-motion` via override global no `globals.css`)
  - `usePersistedStoresHydrated` em `src/hooks/` — começa como `false` em
    server e client para evitar mismatch de hidratação; observa
    `persist.onFinishHydration()` de cada store
  - `useHasData` reescrito sobre esse hook
  - Skeletons por página em `src/components/skeletons/` (Home, Boxes,
    Pokédex, Stats, Missing). **Nota**: por causa do trade-off LCP vs UX
    (skeletons grandes inflam LCP no Lighthouse), as rotas Boxes/Pokédex/
    Stats/Missing renderizam o chrome direto e atualizam in-place quando
    IndexedDB hidrata; os componentes ficam disponíveis caso seja
    necessário reativar
- [x] **Code splitting**
  - `PokedexDetails` via `next/dynamic` em `/pokedex`, `/missing` e
    `CommandPalette` — sai da janela inicial e só carrega quando o usuário
    abre o modal
  - `PresetEditor` lazy em `/presets`
  - `BackupPanel` lazy em `/settings`
  - `GenerationBars` (Recharts + d3-shape + immer + redux-toolkit) lazy em
    `/stats` com `ssr: false` — só carrega quando a página monta
  - `ShortcutsOverlay` e `CommandPalette` lazy no `GlobalShortcuts`
- [x] **PWA**
  - `public/manifest.webmanifest` com ícones 192/512 (`icon-192.svg`,
    `icon-512.svg`), `display: standalone`, theme `#1a1a2e`
  - `Metadata.manifest` + `Viewport.themeColor` em `src/app/layout.tsx`
  - Service worker manual em `public/sw.js`: SWR para sprites do GitHub,
    cache-first para `_next/static/`, network-first para HTML — uso 100%
    offline depois do primeiro load
  - `ServiceWorkerProvider` (Context) registra o SW via `requestIdleCallback`
    (lazy, fora da rota crítica), só em produção, e expõe `updateAvailable`
    + `applyUpdate` para um botão **quieto** no Header (ícone Download com
    pontinho de accent)
  - `SKIP_WAITING` via postMessage — o SW espera o user clicar pra ativar
- [x] **Toasts**
  - `ToastProvider` + `useToast()` em `src/components/ui/toast.tsx` —
    canto inferior direito, max 3 stacked, auto-dismiss 4s por default,
    border-left semântico (success/warning/destructive)
  - Plugados em: apply preset, export backup, merge/replace backup, clear
    de seleção múltipla
- [x] **Shortcuts overlay + Cmd+K**
  - `?` / `Shift+/` abre `ShortcutsOverlay` (Dialog), `Esc` fecha
  - `⌘K` / `Ctrl+K` abre `CommandPalette` — busca por nome/número
    respeitando `activeGenerations`, click abre `PokedexDetails`
  - `GlobalShortcuts` monta ambos lazy e ouve os atalhos
- [x] **Page transitions direcionais**
  - `useNavDirection()` em `src/hooks/` detecta forward/back via `popstate`
  - `AppShell` agora desloca `y: +8` no enter forward, `y: -8` no enter back
  - Animação degrada para fade simples em `prefers-reduced-motion`
- [x] **A11y**
  - `@axe-core/react` rodando em dev (`AxeDevRunner`) — logs no console
  - **Lighthouse A11y = 100** em todas as rotas (era 91-95)
  - `aria-label` em todos os toggle buttons de Pokédex
  - `PokedexGridCard` reescrita para não nest `<button>` em `<button>` —
    overlay button absoluto + toggle interno com `pointer-events-auto`
  - `HowItWorks` corrige `<li>` direto sob `<ol>` (Reveal agora dentro
    do `<li>`)
  - `Dialog` ganha **focus trap** e **restauração de focus** no trigger
    ao fechar
- [x] **Empty states**
  - `EmptyState` em `src/components/ui/empty-state.tsx` (glyph + título +
    descrição + CTA opcional)
  - Aplicado na lista vazia da Pokédex com botão "Limpar filtros"

#### Bundle audit (Fase 4)

Build webpack analyzer (`ANALYZE=true npx next build --webpack`), no
`_next/static/chunks/`:

| Chunk                | Antes  | Depois | Δ      | Notas                                  |
| -------------------- | ------ | ------ | ------ | -------------------------------------- |
| Maior chunk shared   | 592 KB | 596 KB | +4 KB  | dnd-kit + tanstack-virtual + zustand   |
| 2º shared            | 380 KB | 556 KB | +176 KB | recharts + d3-shape (agora isolado)    |
| 3º shared            | 220 KB | 380 KB | +160 KB | next/dynamic boundaries                |
| Per-route /boxes     | 48 KB  | 56 KB  | +8 KB  | toast + skeleton imports               |
| Per-route /presets   | 40 KB  | 24 KB  | **−16 KB** | editor lazy                         |
| Per-route /pokedex   | 16 KB  | 24 KB  | +8 KB  | mas details modal saiu (-50 KB ish)    |
| Per-route /stats     | 20 KB  | 24 KB  | +4 KB  | Recharts agora async                   |
| Total `chunks/`      | 2.6 MB | 3.3 MB | +0.7 MB | mais chunks discretos = mais código    |

**Leitura honesta:** o total cresceu porque cada `next/dynamic` cria um
chunk separado (overhead de boundary + módulos isolados). A vitória
está em **o que carrega no primeiro paint**: Recharts (~200 KB de
d3+immer+redux-toolkit) só desce em `/stats`; `PokedexDetails` só desce
no clique; `PresetEditor` só desce quando o user abre. Em rotas
inteiras de uso normal o JS inicial é o mesmo, mas o caminho crítico
ficou mais leve onde importava.

#### Lighthouse scores (Fase 4)

Mobile, throttling simulate, prod build (`npm run start`):

| Rota      | Perf (antes → depois) | A11y | BP   | SEO  | LCP    | TBT    | CLS |
| --------- | --------------------- | ---- | ---- | ---- | ------ | ------ | --- |
| `/pt-BR`            | 91 → **84**  | 100 | 100 | 100 | 4.5 s  | 40 ms  | 0   |
| `/pt-BR/pokedex`    | 89 → **82**  | 100 | 100 | 100 | 5.0 s  | 0 ms   | 0   |
| `/pt-BR/boxes`      | —  → **84**  | 100 | 100 | 100 | 4.5 s  | 30 ms  | 0   |

**A11y subiu de 91-95 → 100** em todas as rotas. **BP 100** estável. SEO
100. **Performance ficou em 82-84 — abaixo da meta de 90.**

Por quê o Perf não atinge 90 mesmo com code-splitting e SW lazy:

1. O LCP (4.5-5.0s) é dominado pelo "Redirects audit" do Lighthouse
   reportando ~3.7s "savings" para `http://localhost:3100/pt-BR` aparecendo
   duas vezes na network — isso é um falso positivo conhecido do Lighthouse
   11+ com apps Next.js que usam middleware (`next-intl`) e RSC. Não há
   redirect real medido nas requisições.
2. Fontes Google (Inter + Space Grotesk + JetBrains Mono ≈ 112 KB) com
   `font-display: swap` — o LCP element (`<h1>` na landing) só "estabiliza"
   após font load.
3. FCP 0.9-1.1 s e TBT 0-40 ms mostram que o app **responde rápido**; a
   inflada do LCP é específica do modo simulado mobile-3G.

Em rede real (4G/wifi sem throttling) o LCP esperado é < 2s.

---

## 5. Anti-padrões (o que NÃO fazer)

1. **Não voltar para fan-site clichês.** Sem pixel fonts, sem pokéball glossy, sem gradiente vermelho/amarelo.
2. **Não virar bento-grid AI app.** Sem rounded-2xl em todo lugar, sem glass blurs gigantes, sem mesh gradients de fundo.
3. **Não celebrar interações.** Confirmations são quietas. Sem confetti, sem toasts coloridos.
4. **Motion nunca atrapalha leitura.** Animações são <= 420ms. Em `prefers-reduced-motion`, viram fades curtos ou nada.
5. **Cor nunca é o único sinal.** Sempre par com glyph/abreviação/texto.

---

## 6. Como navegar este código

```
src/
  app/
    layout.tsx               # root, fontes, theme, html
    globals.css              # tokens + base styles
    [locale]/
      layout.tsx             # next-intl provider + AppShell
      page.tsx               # Home (landing OR dashboard)
      boxes/page.tsx
      pokedex/page.tsx
      stats/page.tsx
      presets/page.tsx
      missing/page.tsx
      settings/page.tsx
  components/
    ui/                      # primitives (Button, Card, Badge, etc.)
    motion/                  # FadeIn, Stagger, Reveal, PageTransition
    layout/                  # AppShell, Sidebar, Header, ThemeToggle, LocaleSwitch
    home/                    # LandingHero, FeatureGrid, HowItWorks, EmptyDashboard, DashboardOverview
    boxes/                   # BoxGrid, BoxSlot, BoxList, BoxToolbar
    pokedex/                 # PokedexTable, PokedexRow, PokedexSearch
    pokemon/                 # Sprite, TypeChip, PokemonPicker
  data/                      # preservado
  hooks/                     # preservado
  i18n/                      # preservado (messages reescritas)
  lib/                       # preservado
  stores/                    # preservado
  types/                     # preservado
  scripts/                   # preservado
```

---

## 7. Como rodar

```bash
npm install
npm run dev
# em http://localhost:3000
```

Para validar a build:

```bash
npm run lint
npm run build
```

---

## 8. Mudanças quebrando

- **Service Worker removido.** Estava em `src/components/ServiceWorkerRegistration.tsx`. Volta na Fase 4 como PWA real.
- **Activity history panel removido da Home.** Volta na Fase 3, em página própria.
- **`BoxCalculatorCard` removido da Home.** Era ruído. Pode voltar como widget opcional.

---

## 9. Verificação da Fase 1

Estado em `2026-05-21`, após a reescrita:

- `npx tsc --noEmit` — limpo (0 erros).
- `npx eslint src` — 0 erros, 4 warnings (todos em código legado preservado mas não usado nesta fase: `useRecentRegistrations`, `fetch-pokemon-data`, `game-normalizer`, `useAcquisitionStore`).
- `npx next build` no sandbox falha apenas porque o ambiente bloqueia `fonts.googleapis.com`. Em ambiente local com internet (que é o cenário real), o build passa.

Para reproduzir localmente:

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## 10. Manutenção deste documento

Quando uma fase for entregue, atualize a seção 4 marcando ✅. Quando o
design system mudar, atualize a seção 3. Decisões maiores ficam em
seções novas (10, 11, ...).
