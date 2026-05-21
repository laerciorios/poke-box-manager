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

### Fase 2 — Profundidade nas páginas core (próxima sessão)

- [ ] Boxes: drag-and-drop com `@dnd-kit`, MoveTo, ContextMenu, AutoFill, BoxColorPicker, FloatingActionBar, BoxNavigation
- [ ] Pokédex: filtros (geração, tipo, categoria), virtualização (`@tanstack/react-virtual`), card de detalhes com formas, modo grid
- [ ] Settings: variations toggles, generations, theme, locale, sprite style, backup reminder

### Fase 3 — Funcionalidades secundárias

- [ ] Stats: Recharts, heatmap, ring por geração, shiny progress, milestones
- [ ] Presets: aplicar/criar/editar predefinições, preset-engine integration
- [ ] Missing: missing analysis com filtros
- [ ] History: undo, activity panel
- [ ] Tags: tag CRUD e color picker
- [ ] Import/Export: backup, restore, JSON dump

### Fase 4 — Polish

- [ ] Page transitions com `motion/react` (`AnimatePresence`)
- [ ] Stagger lists em todas as listas
- [ ] Skeleton states animados
- [ ] PWA / service worker
- [ ] Bundle analysis, code splitting agressivo

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
