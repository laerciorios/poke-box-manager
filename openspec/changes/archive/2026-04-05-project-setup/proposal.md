## Why

O Pokemon Box Manager precisa de sua fundacao tecnica antes que qualquer feature possa ser construida. Este change estabelece o projeto Next.js 14+ com todo o tooling base — framework, tipagem, estilizacao, componentes UI, state management, e qualidade de codigo. Sem isso, nenhum trabalho subsequente e possivel. Relaciona-se com as secoes 2.1 (Tech Stack), 2.2 (Directory Structure) e 5.1 (Visual Theme) da spec principal.

## What Changes

- Inicializar projeto Next.js 14+ com App Router e TypeScript em modo strict
- Configurar Tailwind CSS com a paleta de cores definida na spec 5.1:
  - Dark: Background `#0f0f0f` / Surface `#1a1a2e` / Accent `#e63946`
  - Light: Background `#f8f9fa` / Surface `#ffffff` / Accent `#e63946`
- Configurar tipografia: Inter (UI) + JetBrains Mono (numeros/codigos)
- Instalar e configurar shadcn/ui com componentes base
- Instalar Zustand para state management (config base, sem stores de negocio)
- Instalar Lucide React para icones
- Implementar toggle dark/light mode com `next-themes` (dark como padrao, conforme spec 5.1)
- Configurar ESLint + Prettier com regras do projeto
- Criar estrutura de diretorios conforme spec secao 2.2
- Criar layout raiz com sidebar de navegacao e header

## Capabilities

### New Capabilities

- `project-foundation`: Inicializacao Next.js 14+, TypeScript strict, estrutura de diretorios, ESLint/Prettier, scripts npm
- `design-system`: Tailwind CSS com paleta spec 5.1, shadcn/ui, dark/light mode, tipografia Inter + JetBrains Mono, layout com sidebar/header
- `state-management-setup`: Zustand instalado e configurado com persist middleware, pronto para uso pelas features

### Modified Capabilities
<!-- Nenhuma — projeto greenfield, nao ha capabilities existentes -->

## Impact

- **Dependencias**: Next.js 14+, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Lucide React, next-themes, Inter font, JetBrains Mono font
- **Dev tooling**: ESLint (next recommended), Prettier
- **Estrutura**: Toda a arvore `src/` conforme spec secao 2.2
- **Nenhum breaking change** — projeto greenfield
