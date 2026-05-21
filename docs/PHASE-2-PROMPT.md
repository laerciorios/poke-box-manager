# Prompt — Fase 2 do PokéBox

> Este documento é o briefing completo para um agente executar a **Fase 2** da
> reescrita do PokéBox. O agente que receber este prompt não terá contexto
> da conversa anterior — tudo o que ele precisa saber está aqui ou nos
> arquivos referenciados.

---

## Quem você é

Você é um engineer trabalhando em **PokéBox**, um companion offline-first para
Pokémon Home. Stack: **Next.js 16 + React 19 + TypeScript + Tailwind 4 +
motion/react (Framer Motion v11) + Zustand + IndexedDB**. O projeto está em
`/Users/laerciorios/Projects/personal/poke-box-manager` (na VM:
`/sessions/<id>/mnt/poke-box-manager/`).

O usuário é **Laercio Rios** — colecionador e dono do produto. Português (pt-BR)
é o idioma padrão da UI; conversa com ele também em português.

---

## O que já existe (Fase 1, ENTREGUE)

Antes de tocar em qualquer coisa, **leia obrigatoriamente** estes dois
documentos, nessa ordem:

1. `docs/REWRITE.md` — plano geral das 4 fases, decisões arquiteturais, design
   system, anti-padrões.
2. `README.md` — visão de alto nível do projeto e status por fase.

Resumo do que foi entregue na Fase 1:

- **Camada de dados preservada**: `src/data/`, `src/stores/`, `src/types/`,
  `src/lib/`, `src/scripts/`, `src/i18n/routing.ts` / `request.ts` /
  `navigation.ts`, `src/proxy.ts`, `src/hooks/`. **Não mexa nessas pastas em
  termos de contrato**, apenas use o que está lá.
- **UI nova**: `src/app/`, `src/components/` e `src/i18n/messages/` foram
  reescritos do zero.
- **Design system**: tokens OKLCH em `src/app/globals.css`, primitives em
  `src/components/ui/`, motion helpers em `src/components/motion/index.tsx`,
  `Sprite` + `TypeChip` em `src/components/pokemon/`.
- **Páginas existentes**:
  - `/` — Home dupla (landing para empty state, dashboard para com dados)
  - `/boxes` — CRUD básico de boxes, grid 6×5, picker de Pokémon, registro
    por slot. **Sem drag-and-drop ainda.**
  - `/pokedex` — busca + filtro por geração + registro. **Sem filtros
    avançados nem virtualização.**
  - `/settings` — tema, idioma, reset. **Sem variations / generations
    toggles / sprite style / backup reminder.**
  - `/stats`, `/presets`, `/missing` — stubs elegantes via `ComingSoon`.

---

## Sua missão: Fase 2

**Objetivo único**: dar profundidade às páginas core (Boxes, Pokédex,
Settings). Sem entrar em Stats/Presets/Missing (esses são Fase 3). Sem
quebrar a Fase 1.

### Escopo detalhado

#### 1. Boxes — drag-and-drop e ações avançadas

Bibliotecas já no `package.json`: `@dnd-kit/core`, `@dnd-kit/sortable`,
`@dnd-kit/accessibility`, `@dnd-kit/utilities`.

Entregar:

- **DnD entre slots da mesma box e entre boxes diferentes**. Use o método
  `moveSlot(fromBoxId, fromIndex, toBoxId, toIndex)` do `useBoxStore`
  (já existe; faz swap atômico). Para reordenar dentro da box, use
  `reorderSlots(boxId, fromIndex, toIndex)`.
- **Keyboard parity completa**. `@dnd-kit/accessibility` deve estar
  cabeado: tecla Espaço pega o slot, setas movem, Espaço solta, Esc cancela.
  O usuário deve ouvir anúncios via screen reader (use as
  `announcements` do dnd-kit, e localize com next-intl).
- **Context menu por slot** (botão direito ou long-press): "Trocar
  Pokémon", "Limpar slot", "Marcar como shiny" (`toggleShiny`), "Marcar
  como registrado", "Mover para…".
- **Move-to dialog**: modal que pede destino (box + slot) com preview.
  Usa `moveSlot`.
- **Box actions menu** (na header da box, ao lado dos botões de
  renomear/excluir): "Limpar todos os slots", "Marcar todos como
  registrados", "Desmarcar todos", "Mover esta box para cima/baixo"
  (`reorderBox`).
- **AutoFill** (botão na toolbar da página): popula slots vazios em
  ordem de Pokédex respeitando `activeGenerations` e `variations` do
  `useSettingsStore`. **Não duplique** Pokémon já presentes em qualquer
  box.
- **Box color picker**: usa `setBoxLabel(boxId, label)` para gravar uma
  string de cor (`'red'`, `'orange'`, `'yellow'`, `'green'`, `'blue'`,
  `'purple'`, `'pink'`, `'gray'`). Aplique a cor como faixa lateral ou
  borda superior da card da box (não como fundo cheio — chrome quieto).
  Paleta segue `src/lib/box-label-colors.ts` (já existe e está
  preservado — leia para entender o contrato de cores).
- **Floating action bar** para seleção múltipla: ao Shift+click ou
  Cmd+click em slots, mostre uma barra flutuante no rodapé com
  "X selecionados | Marcar registrados | Desmarcar | Limpar |
  Mover para…".
- **Box navigation**: setas de teclado (← → ou PageUp/PageDown) movem
  entre boxes; J/K como atalho alternativo.

Acesso permitido a esses arquivos (referência da implementação antiga,
útil para inspiração — mas **não copie sem revisar**, o design system mudou):
o código antigo está no histórico do git em `git log -- src/components/boxes/`.

#### 2. Pokédex — filtros completos, virtualização e detalhes

Bibliotecas já no `package.json`: `@tanstack/react-virtual`.

Entregar:

- **Virtualização** com `useVirtualizer` do `@tanstack/react-virtual` —
  hoje a página corta em 240 itens; precisa renderizar todos os
  ~1.300+ sem perder fluidez.
- **Filtros adicionais** além da geração que já existe:
  - **Por tipo** (multi-select): use `TYPE_COLORS` de
    `src/lib/type-colors.ts`. Mostre os 18 tipos como chips clicáveis.
  - **Por categoria** (multi-select): `normal`, `legendary`, `mythical`,
    `baby`, `ultra-beast`, `paradox`.
  - **Por status de registro**: "Todos" / "Registrados" / "Faltantes".
  - **Por variação ativa**: respeitar `useSettingsStore.variations` — se
    `regionalForms = true`, formas regionais aparecem como linhas extra
    sob o Pokémon base.
- **Modo de visualização** (toggle): tabela densa (linha por linha, igual
  ao `useSettingsStore.pokedexView === 'table'`) vs grid (cards atuais).
  Use `setPokedexView` que já existe na store.
- **Card de detalhes** (modal/sheet ao clicar em um Pokémon):
  - Sprite grande (normal + shiny lado a lado se shiny tracker estiver ativo).
  - Nome localizado, número, geração, tipos.
  - **Todas as formas** disponíveis do Pokémon (regionais, mega, gmax,
    origin, etc.). Cada forma com sua sprite e botão de registrar/desregistrar.
  - Mostrar evolution chain quando disponível (use
    `src/data/evolution-chains.json` + `evolutionChainId` do `PokemonEntry`).
- **Busca aprimorada**: aceitar `#001`, `001`, `1`, `bulbasaur`,
  `bulba`, e nome localizado (`bulbasauro` em pt-BR não muda muita coisa,
  mas o contrato está no `src/lib/pokemon-names.ts`).

#### 3. Settings — toggles e reminders completos

Entregar:

- **Variations panel**: 12 toggles de `VariationToggles`
  (regionalForms, genderForms, unownLetters, vivillonPatterns,
  alcremieVariations, colorVariations, sizeVariations, megaEvolutions,
  gmaxForms, battleForms, originForms, costumedPokemon). Use
  `setVariation(key, value)`. Para cada toggle, mostre quantos Pokémon
  serão incluídos quando ativado (use `src/lib/variation-counts.ts`,
  já preservado). Mostre o total dinâmico com e sem variações.
- **Active generations** picker: chips para Gen 1 → 9, multi-select.
  Use `setActiveGenerations`.
- **Sprite style** picker: 4 opções (`home-3d`, `pixel-gen5`,
  `pixel-gen8`, `official-art`) com **preview de uma sprite** para cada
  estilo. Use `setSpriteStyle`. O `Sprite.tsx` precisa começar a
  respeitar essa preferência — hoje sempre usa `sprite` ou
  `spriteShiny`; passe a montar o URL baseado no estilo. (As URLs
  estão em `src/data/pokemon-*.json` — investigue o shape.)
- **Show Pokémon names in box** toggle: usa `setShowPokemonNamesInBox`.
  Quando ativo, `BoxSlotCell` mostra o nome embaixo do sprite.
- **Shiny tracker enabled** toggle: usa `setShinyTrackerEnabled`.
- **Backup reminder banner**: aparece no topo de TODAS as páginas se
  `pendingChanges > 5` E `lastBackup` for `undefined` ou tiver mais de
  7 dias. Texto: "Você fez {N} mudanças desde o último backup.
  [Fazer backup agora] [Lembrar mais tarde]".
- **Backup / Restore**: botões "Exportar dados" (download de JSON com
  `{ boxes, pokedex, settings, presets, tags, history }`) e "Importar
  dados" (file picker + diff preview + confirmação). Use as funções
  já existentes em `src/lib/export/` e `src/lib/import/` (preservadas).
- **Reset zone** já existe; revise se a confirmação é robusta.

---

## Regras de arquitetura que você DEVE seguir

1. **Não toque na camada de dados.** `src/stores/`, `src/types/`,
   `src/data/`, `src/scripts/`, `src/lib/` são preservados. Você usa o
   contrato deles. Se precisar **estender** um store (ex: adicionar um
   novo método), pode — mas mantenha retrocompatibilidade do persist
   (incremente `version` e adicione `migrate`).

2. **Motion sempre via wrappers em `src/components/motion/`**, ou via
   `motion/react` direto. **Toda animação respeita
   `useReducedMotion()`** (curto-circuita para fade ou para
   `duration: 0`). Não há exceção a isso.

3. **Tokens, nunca hex direto na UI.** Use as CSS variables definidas
   em `globals.css`: `var(--accent)`, `var(--surface-2)`,
   `var(--registered)`, etc. Cores de tipo Pokémon (TYPE_COLORS) podem
   ficar inline porque são dado, não chrome — mas só dentro de chips
   de tipo e gráficos.

4. **Acessibilidade primeiro**:
   - Todo controle interativo tem `aria-label` ou label visível.
   - Focus ring está definido globalmente — não desabilite com
     `outline-none` sem substituir.
   - DnD obriga keyboard parity (Espaço + setas).
   - Tipo, geração, registro e shiny **nunca** dependem só de cor.

5. **i18n obrigatório**: nenhuma string visível ao usuário fica
   hardcoded em código. Tudo passa por `useTranslations()` e tem
   versão em `src/i18n/messages/pt-BR.json` E `en.json`. pt-BR é o
   default; mantenha as duas em paridade.

6. **Tarefas** (`TaskCreate` / `TaskUpdate`): use o sistema de tarefas
   para tracking. Crie a task list logo no início, marque `in_progress`
   antes de começar cada tarefa, `completed` ao terminar.

7. **Anti-padrões proibidos** (revisar seção 5 de `docs/REWRITE.md`):
   - Sem fan-site clichês (pixel fonts, pokéball glossy, gradientes
     vermelho/amarelo).
   - Sem bento-grid AI app (glass blur enorme, mesh gradients,
     rounded-2xl em tudo).
   - Sem celebração de interação (confetti, achievement toasts).
   - Sem motion >420ms.

---

## Critérios de aceite

Você só termina a Fase 2 quando **todos** os pontos abaixo passam:

- [ ] `npx tsc --noEmit` retorna 0 erros.
- [ ] `npx eslint src` retorna 0 erros (warnings em código legado são ok).
- [ ] Manualmente testado no `npm run dev`:
  - [ ] Arrastar um Pokémon entre slots na mesma box funciona.
  - [ ] Arrastar entre boxes diferentes funciona.
  - [ ] Tab + Espaço + setas + Espaço move um slot por teclado.
  - [ ] Context menu abre em botão direito ou long-press e tem 5+ opções.
  - [ ] Pokédex carrega ~1.300 itens sem lag (virtualização ativa).
  - [ ] Filtro por tipo + categoria + status funciona em combinação.
  - [ ] Toggle de variations adiciona/remove linhas da Pokédex em tempo real.
  - [ ] Clique em Pokémon abre detalhes com formas e evolution chain.
  - [ ] Settings mostra os 12 variation toggles, todos respondendo.
  - [ ] Trocar sprite style muda as sprites em Boxes e Pokédex.
  - [ ] Export gera JSON válido; Import restaura.
  - [ ] Backup reminder aparece após 6+ mudanças sem backup.
- [ ] `prefers-reduced-motion: reduce` no devtools degrada animações
  graciosamente (sem quebrar funcionalidade).
- [ ] Toggle pt-BR ↔ en funciona em todas as strings novas.
- [ ] **Documentação atualizada**:
  - `docs/REWRITE.md` — seção 4, marcar Fase 2 como ✅ e listar o que
    foi entregue.
  - `README.md` — atualizar a lista "Status por fase".

---

## Como começar (sugestão de ordem)

1. Ler `docs/REWRITE.md` + `README.md` + `src/stores/*.ts` (entender o
   contrato).
2. Criar a task list completa (uma task por subentrega).
3. Implementar Boxes DnD primeiro (entrega de maior impacto).
4. Pokédex virtualizada + filtros + detalhes.
5. Settings completo + Backup reminder.
6. Verificação final (lint, tsc, smoke test).
7. Atualizar `docs/REWRITE.md` e `README.md`.

---

## Estilo de trabalho

- Trabalhe **uma página por vez**. Não tente fazer Boxes + Pokédex +
  Settings em paralelo — termina meia-boca em três.
- **Cada feature nova ganha um componente próprio** em
  `src/components/{boxes,pokedex,settings}/`. Não inche os
  `page.tsx`.
- Quando hesitar sobre design, prefira o lado **quieto**: borda fina,
  surface-2 ao invés de gradient, motion <300ms.
- Se aparecer dúvida de produto que não dá pra resolver lendo os docs,
  **pergunte ao usuário** via `AskUserQuestion`. Não chute.
- Ao fim, faça um resumo curto da entrega no chat (não no doc) —
  o `REWRITE.md` é a fonte canônica.

Boa Fase 2.
