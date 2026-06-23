# Monorepo Boilerplate

Boilerplate full-stack para produção com **Turborepo**, **NestJS 11**, **React 19 (Vite)**, **Nginx** e **Docker**.

---

## Visão Geral

Este boilerplate fornece uma base sólida para aplicações web modernas usando uma arquitetura de monorepo. Ele combina:

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Orquestrador** | Turborepo 2.x | Build cache, paralelismo, pipeline de tarefas |
| **Backend** | NestJS 11 + TypeORM | API REST com autenticação JWT |
| **Frontend** | React 19 + Vite 8 + React Router 7 | SPA com tema escuro e feed social |
| **Banco de Dados** | SQLite (dev) / PostgreSQL (prod) | Persistência via Docker Profiles |
| **Proxy Reverso** | Nginx | Roteamento /api/* para o backend em produção |
| **Containerização** | Docker + Compose | Build multi-stage e deploy em VPS |
| **Tipos Compartilhados** | `@monorepo/contracts` | Contrato TypeScript entre frontend e backend |

---

## Arquitetura e Topologia

```
monorepo/
├── apps/                          # Aplicações (deployáveis)
│   ├── api/                       #   NestJS REST API
│   │   ├── src/
│   │   │   ├── modules/           #     Módulos de domínio (usuarios, posts…)
│   │   │   ├── shared/            #     Guards, strategies, utils internos
│   │   │   └── data/              #     Database module, seeds
│   │   └── tests/
│   └── web/                       #   React SPA (Vite)
│       ├── src/
│       │   ├── modules/           #     Páginas (inicio, entrar…)
│       │   └── shared/            #     Contextos, serviços (Axios)
│       └── tests/
│
├── packages/                      # Bibliotecas compartilhadas
│   └── contracts/                 #   Tipos, interfaces, enums (contrato API)
│       └── src/
│           ├── types/             #     Usuario, Post, Responses
│           └── enums/            #     Roles, Rotas
│
├── docker/                        # Infraestrutura
│   └── nginx/                     #   Configuração do proxy reverso
│
├── turbo.json                    # Pipeline de tasks do Turborepo
├── docker-compose.yml             # Dev e Prod com Docker Profiles
├── .env                           # Variáveis de ambiente
└── tsconfig.base.json            # Configuração base do TypeScript
```

### Fluxo de dependências

```
       ┌───────────┐     HTTP     ┌──────────┐
       │  apps/web │ ──────────►  │ apps/api │
       └─────┬─────┘              └─────┬────┘
             │ importa                  │ importa
             ▼                          ▼
       ┌──────────────────────────────────────┐
       │         @monorepo/contracts          │
       │  (tipos, interfaces, enums, DTOs)    │
       └──────────────────────────────────────┘
```

- **apps/** — dependem de `@monorepo/contracts` para tipos, mas não dependem um do outro
- **packages/contracts** — não depende de nenhuma app (é puramente declarativo)
- **docker/** — infraestrutura, sem dependência de código

---

## Pré-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Docker** + **Docker Compose**
- **Git**

---

## Developer Experience (Rodar Localmente)

### 1. Instalar dependências

```bash
npm install
```

Isso instala todas as dependências de todos os workspaces (`apps/*` e `packages/*`) e o Turborepo.

### 2. Configurar ambiente

```bash
# O arquivo .env já existe na raiz com valores padrão para desenvolvimento.
# Não é necessário alterar nada para rodar localmente.
```

### 3. Rodar em desenvolvimento (sem Docker)

```bash
# Tudo ao mesmo tempo (API + Web) via Turborepo
npm run dev

# Ou individualmente:
npm run dev:api    # API em http://localhost:3000
npm run dev:web    # Web em http://localhost:3001
```

O Turborepo gerencia a execução paralela e faz cache dos builds. Na primeira execução, o SQLite é criado automaticamente com as seeds (usuário administrador padrão).

### 4. Rodar em desenvolvimento (com Docker)

```bash
# Usar o profile 'dev' do Docker Compose
docker compose --profile dev up -d
```

Isso sobe:
- `api-dev`: API NestJS na porta 3000
- `web-dev`: Frontend na porta 3001

### 5. Build

```bash
# Compila todos os pacotes (com cache incremental do Turborepo)
npm run build
```

### 6. Testes

```bash
npm test           # Roda Jest em todos os workspaces
```

### 7. Lint e Formatação

```bash
npm run lint       # ESLint em todo o monorepo
npm run format     # Prettier em todo o monorepo
```

---

## Comunicação Frontend-Backend (Contrato de Tipos)

O pacote `@monorepo/contracts` é o **ponto único de verdade** para os tipos compartilhados entre o frontend e o backend.

### Como funciona

```typescript
// packages/contracts/src/types/usuario.types.ts
export interface Usuario {
    id: number;
    nomeCompleto: string;
    email: string;
    tipo: UsuarioRole;
    // ...
}
```

**No backend (NestJS):**
```typescript
import { Usuario } from '@monorepo/contracts';
// Usa a interface para tipar DTOs e responses do controller
```

**No frontend (React):**
```typescript
import type { Usuario } from '@monorepo/contracts';
// Usa o mesmo tipo para tipar o estado do contexto de autenticação
```

### Benefícios

- **Type Safety cross-stack** — uma mudança no contrato quebra o build de ambos os lados
- **Sem duplicação** — a interface `Usuario` não precisa ser redefinida no frontend
- **Documentação viva** — o contrato é a documentação da API
- **Facilita codegen** — base para gerar clientes HTTP tipados ou OpenAPI specs

---

## Troca de Banco de Dados (SQLite ↔ PostgreSQL)

O ambiente de desenvolvimento usa **SQLite** (arquivo local `base.sqlite`) e o ambiente de produção usa **PostgreSQL** (container Docker). Essa transição é transparente via variáveis de ambiente.

### Desenvolvimento (SQLite)

```yaml
# docker-compose.yml - profile: dev
api-dev:
    environment:
        - DATABASE_HOST=localhost  # Usa SQLite automaticamente
```

### Produção (PostgreSQL)

```yaml
# docker-compose.yml - profile: prod
postgres:
    image: postgres:16-alpine
    environment:
        - POSTGRES_DB=monorepo
        - POSTGRES_USER=monorepo_user
        - POSTGRES_PASSWORD=monorepo_password

api-prod:
    environment:
        - DATABASE_HOST=postgres  # Conecta ao PostgreSQL
        - DATABASE_PORT=5432
        - DATABASE_USER=monorepo_user
        - DATABASE_PASSWORD=monorepo_password
        - DATABASE_NAME=monorepo
```

### Lógica de Seleção (app.module.ts)

```typescript
TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => {
        const databaseHost = configService.get<string>('DATABASE_HOST');

        // Se DATABASE_HOST estiver definido e não for localhost, usa PostgreSQL
        if (databaseHost && databaseHost !== 'localhost') {
            return {
                type: 'postgres',
                host: databaseHost,
                // ... configurações do PostgreSQL
            };
        }

        // Caso contrário, usa SQLite
        return {
            type: 'sqlite',
            database: '../../base.sqlite',
            // ... configurações do SQLite
        };
    },
});
```

---

## Deploy em Produção (VPS)

Este boilerplate usa Docker multi-stage com Nginx como proxy reverso para deploy em VPS.

### Passo a passo

#### 1. Clone o projeto na VPS

```bash
git clone https://github.com/seu-user/monorepo.git
cd monorepo
```

#### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` com os valores de produção:

```bash
# API
API_ENV=prod
API_PORTA=3000
API_CORS_ORIGENS=http://seu-dominio.com
API_SAL=12
API_PIMENTA=sua-senha-pimenta-forte
USUARIO_JWT=sua-chave-jwt-secreta
USUARIO_SENHA=sua-senha-admin-producao

# Banco de dados
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=monorepo_user
DATABASE_PASSWORD=senha-forte-postgres
DATABASE_NAME=monorepo
```

#### 3. Execute com Docker Compose (Profile Prod)

```bash
# Build e inicialização dos containers
docker compose --profile prod up -d --build
```

#### 4. Verifique os serviços

```bash
# Verificar status
docker compose ps

# Ver logs
docker compose logs -f api-prod
docker compose logs -f web-prod

# Health checks
curl http://localhost:3000/ola-mundo    # API
curl http://localhost/                  # Frontend
```

### Arquitetura de produção

```
Internet ──► Porta 80/443 ──► Nginx (web-prod)
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
              /api/* (proxy_pass)    /* (arquivos estáticos)
                    │                    │
                    ▼                    ▼
            API (:3000)              React SPA
            (api-prod)               (dist/web)
                    │
                    ▼
            PostgreSQL (:5432)
            (postgres)
```

- O **Nginx** serve os arquivos estáticos do frontend (build do Vite)
- Requisições para `/api/*` são proxy reverso para o container da API
- A API se conecta ao PostgreSQL via variáveis de ambiente
- Volumes persistem os dados do banco (`postgres_data`)

### Comandos úteis

```bash
# Parar
docker compose --profile prod down

# Rebuild
docker compose --profile prod up -d --build --force-recreate

# Logs específicos
docker compose --profile prod logs -f api-prod
docker compose --profile prod logs -f web-prod
docker compose --profile prod logs -f postgres
```

---

## Estrutura de Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe API + Web em paralelo (Turborepo) |
| `npm run dev:api` | Apenas a API |
| `npm run dev:web` | Apenas o frontend |
| `npm run build` | Compila todos os pacotes com cache |
| `npm run test` | Roda testes em todos os workspaces |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Testes com relatório de cobertura |
| `npm run lint` | ESLint em todo o código |
| `npm run format` | Prettier em todo o código |
| `npm run format:check` | Verifica formatação sem alterar |
| `docker compose --profile dev up -d` | Dev com Docker |
| `docker compose --profile prod up -d` | Prod com Docker |

---

## Variáveis de Ambiente

| Variável | Descrição | Padrão (dev) |
|----------|-----------|--------------|
| `NODE_ENV` | Ambiente | `development` |
| `API_ENV` | Ambiente da API | `dev` |
| `API_PORTA` | Porta da API | `3000` |
| `APP_PORT` | Porta do Frontend | `3001` |
| `DATABASE_HOST` | Host do banco | (vazio = SQLite) |
| `DATABASE_PORT` | Porta do PostgreSQL | `5432` |
| `USUARIO_JWT` | Chave JWT | `usuario-jwt` |
| `USUARIO_SENHA` | Senha admin padrão | `senha123` |
| `VITE_API_URL` | URL da API para o frontend | `http://localhost:3000` |

---

## Documentação do Projeto

A documentação arquitetural detalhada está em `.opencode/`:

| Arquivo | Conteúdo |
|---------|----------|
| `.opencode/PADROES.md` | Arquitetura completa, convenções de código, padrões de CSS, testes, git workflow |
| `.opencode/instrucoes.md` | Padrões do projeto, estrutura de módulos, convenções rápidas para desenvolvimento |
| `.opencode/modulos/` | Documentação de módulos implementados (ex.: `USUARIO.md`) |
| `.opencode/specs/` | Spec-Driven Development — especificações de novas funcionalidades |
| `.opencode/TEMPLATE-SPEC.md` | Template para criar novas specs |

---

## Contribuição

### Spec-Driven Development

Toda funcionalidade começa com uma spec em `.opencode/specs/SPEC-{nome}.md` seguindo o template em `.opencode/TEMPLATE-SPEC.md`. A spec deve ser aprovada antes de qualquer implementação.

### Skills de Scaffolding

O projeto inclui skills automatizadas para acelerar a criação de novos módulos:

| Skill | Gera |
|-------|------|
| `criar-modulo-api` | Módulo NestJS completo (entity, DTOs, service, controller, module) |
| `criar-modulo-web` | Página React (page, viewmodel, style, rota, repositório) |

### Padrões

Consulte `.opencode/PADROES.md` para a documentação completa de arquitetura, convenções de código, testes e git workflow.

---

## Boas Práticas

1. **Nunca importe `apps/api` de `apps/web`** — use sempre `@monorepo/contracts` para tipos compartilhados
2. **Mantenha o contrato enxuto** — `packages/contracts` deve conter apenas tipos, DTOs e enums, nunca lógica de negócio
3. **Use as filters do Turborepo** para build escalável: `turbo run build --filter=@monorepo/api`
4. **Ambientes** — use `.env` para dev, crie variáveis inline para produção no `docker-compose.yml`
5. **Migrações** — em produção, desligue `synchronize` do TypeORM e use migrations reais
6. **Secrets** — nunca commite secrets no `.env`; use Docker Secrets ou variáveis inline em produção

---

## Licença

UNLICENSED — Uso interno.