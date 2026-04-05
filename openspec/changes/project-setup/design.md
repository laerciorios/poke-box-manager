## Context

Projeto greenfield — nenhum codigo existe ainda. Este change cria toda a fundacao tecnica do Pokemon Box Manager: framework, tipagem, estilizacao, componentes, state management, e tooling de qualidade de codigo. A spec principal define o stack completo (secao 2.1), a estrutura de diretorios (secao 2.2), e o tema visual (secao 5.1).

O app sera offline-first, sem backend. Dados de Pokemon virao da PokeAPI em build-time (change futuro). Dados do usuario serao persistidos com Zustand + IndexedDB.

## Goals / Non-Goals

**Goals:**
- Projeto Next.js 14+ funcional com App Router, TypeScript strict, build/dev operacionais
- Tailwind CSS com paleta spec 5.1 (Dark: `#0f0f0f`/`#1a1a2e`/`#e63946`, Light: `#f8f9fa`/`#ffffff`/`#e63946`)
- Tipografia: Inter para UI, JetBrains Mono para numeros/codigos
- shadcn/ui inicializado com componentes fundamentais
- Zustand instalado com persist middleware configurado
- Lucide React para icones
- Dark/light mode toggle funcional (dark como padrao)
- Layout raiz com sidebar de navegacao e header
- ESLint + Prettier configurados
- Estrutura de diretorios conforme spec 2.2

**Non-Goals:**
- Implementar features de negocio (boxes, pokedex, stats)
- Consumir dados da PokeAPI
- Criar Zustand stores de negocio (boxStore, pokedexStore, etc.)
- Configurar i18n/next-intl (sera um change separado)
- Configurar drag & drop (@dnd-kit)
- Configurar testes (Vitest/Testing Library/Playwright)
- Deploy ou CI/CD

## Decisions

### 1. Next.js 14+ com App Router

**Escolha:** App Router com React Server Components por padrao.
**Razao:** Spec exige App Router. Suporta SSG, layouts aninhados, e streaming. A estrutura `src/app/` com subdiretorios por rota facilita organizacao.
**Alternativa descartada:** Pages Router — sem RSC, layouts menos ergonomicos.

### 2. Paleta de cores via CSS custom properties

**Escolha:** Definir cores como CSS custom properties (`:root` e `.dark`) e referencia-las no Tailwind via `@theme`.
**Razao:** shadcn/ui utiliza CSS variables para temas. Permite troca dark/light via classe `dark` no `<html>`. A paleta da spec 5.1 sera mapeada para variaveis semanticas:

```css
:root {
  --background: #f8f9fa;
  --surface: #ffffff;
  --accent: #e63946;
}
.dark {
  --background: #0f0f0f;
  --surface: #1a1a2e;
  --accent: #e63946;
}
```

### 3. Tipografia com next/font

**Escolha:** Usar `next/font/google` para carregar Inter e JetBrains Mono com font-display swap.
**Razao:** Otimiza carregamento (self-hosted, sem layout shift). Inter para toda a UI, JetBrains Mono para numeros de Pokedex, IDs, e codigos.

### 4. shadcn/ui com style "new-york"

**Escolha:** Style "new-york" — bordas mais definidas, visual mais limpo.
**Razao:** Melhor adequacao para UI densa (grids 6x5, tabelas de pokedex). Componentes instalados sob `src/components/ui/`.
**Alternativa:** Style "default" — mais arredondado, menos adequado para dashboard.

### 5. Zustand com persist middleware

**Escolha:** Instalar Zustand com `persist` middleware. Neste change, apenas a infraestrutura — nenhum store de negocio.
**Razao:** A spec define Zustand como state manager (secao 2.1). O persist middleware sera necessario para todas as stores futuras (IndexedDB). Configurar agora evita retrabalho.
**Configuracao base:** Criar um `src/lib/store.ts` com helper para criar stores persistidas.

### 6. next-themes para dark mode

**Escolha:** Usar `next-themes` para gerenciar o tema, com `attribute="class"` e `defaultTheme="dark"`.
**Razao:** Integra-se naturalmente com Tailwind (classe `dark`), SSR-safe (evita flash), e persiste preferencia em cookie/localStorage. Spec define dark como padrao (secao 5.1).

### 7. Estrutura de diretorios — criar apenas o necessario

**Escolha:** Criar todos os diretorios da spec 2.2, mas com arquivos reais apenas onde este change produz conteudo. Demais diretorios terao `.gitkeep` para manter a estrutura.
**Razao:** Permite que changes futuros encontrem a estrutura esperada sem precisar cria-la.

## Risks / Trade-offs

**[Next.js version]** → Usar a versao estavel mais recente. Evitar features experimentais (como Turbopack em producao). Mitigation: pin de versao no package.json.

**[shadcn/ui sao arquivos copiados, nao uma lib]** → Manutencao manual dos componentes. Mitigation: instalar apenas componentes necessarios, adicionar sob demanda.

**[Dark mode flash em SSR]** → next-themes pode causar flash se mal configurado. Mitigation: usar `suppressHydrationWarning` no `<html>` e configurar `attribute="class"`.

**[Zustand sem stores concretas pode parecer prematuro]** → Instalar agora garante que o persist middleware e testado antes de adicionar stores de negocio. O custo e minimo (uma dependencia).
