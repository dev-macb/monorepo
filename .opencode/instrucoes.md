# Instruções do Projeto — Monorepo

Stack: **Turborepo** | **NestJS 11** + TypeORM | **React 19** + Vite | SQLite/PostgreSQL.
Idioma principal: **Português** (código, arquivos, mensagens, commits).

---

## Regra fundamental — Spec-Driven Development

**Nunca implemente direto.** Toda funcionalidade começa com uma spec em `.opencode/SPEC-{nome}.md` seguindo o template `.opencode/TEMPLATE-SPEC.md`. A spec deve ser mostrada ao usuário para aprovação antes de qualquer implementação.

---

## Estrutura do monorepo

```
monorepo/
├── apps/
│   ├── api/           # NestJS (backend)
│   └── web/           # React + Vite (frontend)
├── packages/
│   └── contracts/     # Tipos, interfaces, enums compartilhados
└── .opencode/         # Documentação e specs
```

---

## Padrão de módulo — Backend

`apps/api/src/modules/{dominio}/`
```
{dominio}/
├── dtos/
│   ├── cadastrar-{entidade}.dto.ts
│   └── atualizar-{entidade}.dto.ts
├── entities/
│   └── {entidade}.entity.ts
├── {entidade}.controller.ts
├── {entidade}.service.ts
└── {entidade}.module.ts
```

---

## Padrão de módulo — Frontend

`apps/web/src/modules/{modulo}/`
```
{modulo}/
├── {modulo}.page.tsx       # Componente de página (export { NomePage })
├── {modulo}.viewmodel.ts   # Hook de estado (function usa{Nome}ViewModel)
└── {modulo}.style.css      # Estilos (CSS puro, importado no page)
```

---

## Convenções rápidas

| O quê | Padrão | Exemplo |
|-------|--------|---------|
| Idioma geral | Português | `usuario`, `entrar`, `cadastrar` |
| Contracts | Português | `usuario.types.ts`, `TipoUsuario` |
| Arquivos de módulo (api) | `{entidade}.{tipo}.ts` | `usuario.controller.ts` |
| Arquivos de módulo (web) | `{modulo}.{tipo}.tsx` | `entrar.page.tsx`, `entrar.viewmodel.ts` |
| Componentes compartilhados | `{nome}.component.tsx` | `feed.component.tsx` |
| ViewModel hook | `usa{Nome}ViewModel` | `usaEntrarViewModel` |
| DI do frontend | `usaDependencias()` → `{ usuarioRepository }` | — |
| Rotas (api) | `Rotas.{DOMINIO}` em `rotas.enum.ts` | `Rotas.USUARIOS` |
| Rotas (web) | `rotiador.tsx` com `createBrowserRouter` | — |
| Testes | `{arquivo}.spec.ts` ao lado ou em `tests/` | — |

---

## Padrões de código importantes

- **API**: DTOs com `class-validator`, services injetam `@InjectRepository`, controllers usam `@Publico()` ou `@UseGuards(UsuarioGuard)`
- **Web**: ViewModels recebem repositórios por parâmetro (não chamam `usaDependencias` internamente), páginas montam o JSX
- **DI (web)**: `DependenciaProvider` no topo da árvore, `usaDependencias()` para consumir
- **Auth (web)**: `AutenticacaoProvider` → `usaAutenticacao()` retorna `{ payload, carregando, isAuthenticated, sair }`
- **JWT**: `JwtService` (frontend) e `UsuarioGuard` + `UsuarioStrategy` (backend)
- **DB**: SQLite dev / PostgreSQL prod, `synchronize: true` só em dev
- **Estilos**: CSS puro (não CSS Modules, não Tailwind), tema escuro com variáveis `:root`

---

## Skills disponíveis (use `skill("nome")` para carregar)

| Skill | Quando usar |
|-------|-------------|
| `criar-modulo-api` | Scaffold completo de módulo NestJS (entity, DTOs, service, controller, module) |
| `criar-modulo-web` | Scaffold de página React (page, viewmodel, style, rota, repositório) |

---

## Aprendizados entre sessões

- `.opencode/APRENDIZADOS.md` — registre descobertas e correções para não repetir erros

---

## Estrutura da pasta `.opencode`

```
.opencode/
├── instrucoes.md        # Este arquivo — padrões do projeto
├── APRENDIZADOS.md      # Aprendizados entre sessões
├── PADROES.md           # Documentação arquitetural detalhada
├── TEMPLATE-SPEC.md     # Template para specs (SDD)
├── specs/               # Specs de funcionalidades (planejamento futuro)
│   ├── SPEC-{nome}.md
│   └── .gitkeep
├── modulos/             # Documentação de módulos já implementados
│   └── {MODULO}.md      # Ex.: USUARIO.md, POSTAGEM.md
└── skills/              # Skills (scaffolding automatizado)
    ├── criar-modulo-api/
    └── criar-modulo-web/
```

## Leia também

- `.opencode/PADROES.md` — documentação completa com arquitetura, naming, exemplos detalhados, pitfalls
- `.opencode/TEMPLATE-SPEC.md` — template para criar specs no formato SDD
- `.opencode/modulos/` — documentação de módulos existentes
- `.opencode/specs/` — specs de funcionalidades futuras
