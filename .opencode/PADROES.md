# Padrões do Projeto — Monorepo

Documentação completa de arquitetura, convenções de nomenclatura, estrutura de código e boas práticas para desenvolvimento assistido por IA.

---

## Sumário

1. [Stack Tecnológica](#1-stack-tecnológica)
2. [Estrutura do Monorepo](#2-estrutura-do-monorepo)
3. [Convenções de Nomenclatura](#3-convenções-de-nomenclatura)
4. [Arquitetura do Backend (NestJS)](#4-arquitetura-do-backend-nestjs)
5. [Arquitetura do Frontend (React)](#5-arquitetura-do-frontend-react)
6. [Contratos Compartilhados](#6-contratos-compartilhados)
7. [Roteamento](#7-roteamento)
8. [Autenticação e Autorização](#8-autenticação-e-autorização)
9. [Configurações do Projeto](#9-configurações-do-projeto)
10. [Testes](#10-testes)
11. [Fluxo de Criação de Módulo](#11-fluxo-de-criação-de-módulo)

---

## 1. Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Orquestrador | Turborepo | 2.x |
| Gerenciador de pacotes | npm | 10.x |
| Backend | NestJS | 11 |
| ORM | TypeORM | 0.3 |
| Frontend | React | 19 |
| Build frontend | Vite | 8 |
| Roteamento frontend | React Router | 7 |
| Banco dev | SQLite | — |
| Banco prod | PostgreSQL | 16 |
| Autenticação | JWT (passport-jwt) | — |
| Validação | class-validator + class-transformer | — |
| Testes | Jest + ts-jest | — |
| Lint | ESLint (flat config) | — |
| Formatação | Prettier | — |

---

## 2. Estrutura do Monorepo

```
monorepo/
├── apps/
│   ├── api/                           # NestJS REST API
│   │   ├── src/
│   │   │   ├── main.ts                # Bootstrap, CORS, seeds
│   │   │   ├── app.module.ts          # Módulo raiz
│   │   │   ├── app.controller.ts      # GET /ola-mundo
│   │   │   ├── app.service.ts
│   │   │   ├── modules/               # Módulos de domínio
│   │   │   │   ├── usuarios/          #   Ex.: CRUD de usuários
│   │   │   │   └── postagens/         #   (placeholder)
│   │   │   ├── shared/                # Código compartilhado do backend
│   │   │   │   ├── decorators/        #   @Publico(), @UsuarioPermissoes()
│   │   │   │   ├── enums/             #   rotas.enum.ts, tabelas.enum.ts
│   │   │   │   ├── guards/            #   usuario.guard.ts
│   │   │   │   ├── strategies/        #   usuario.strategy.ts
│   │   │   │   ├── utils/             #   senha.util.ts, logger.util.ts
│   │   │   │   └── types.ts
│   │   │   └── data/                  # Database + seeds
│   │   │       ├── database.module.ts
│   │   │       ├── database.service.ts
│   │   │       └── seeds/
│   │   └── tests/
│   │
│   └── web/                           # React SPA
│       ├── src/
│       │   ├── main.tsx               # Entry point
│       │   ├── app/
│       │   │   ├── app.tsx            # Providers (DI + Auth)
│       │   │   └── rotiador.tsx       # Rotas
│       │   ├── modules/               # Páginas
│       │   │   ├── inicio/
│       │   │   ├── entrar/
│       │   │   └── registrar-se/
│       │   └── shared/                # Código compartilhado do frontend
│       │       ├── components/        #   Componentes reutilizáveis
│       │       │   ├── feed/
│       │       │   ├── sidebar/
│       │       │   ├── post-card/
│       │       │   ├── tags-panel/
│       │       │   └── dialogs/
│       │       │       └── user-profile/
│       │       ├── contexts/          #   AutenticacaoContext
│       │       ├── di/                #   DependenciaProvider, usaDependencias
│       │       ├── interfaces/        #   Interfaces dos repositórios
│       │       ├── models/            #   Re-exports de @monorepo/contracts
│       │       ├── repositories/      #   Implementações dos repositórios
│       │       ├── services/          #   ApiService, JwtService
│       │       └── utils/             #   FormatadorUtil
│       └── tests/
│
├── packages/
│   └── contracts/                     # Tipos, interfaces, enums compartilhados
│       └── src/
│           ├── index.ts               # Barrel exports
│           ├── types/
│           │   ├── usuario.types.ts
│           │   ├── postagem.types.ts
│           │   └── api.types.ts
│           └── enums/
│               └── tipo-usuario.enum.ts
│
├── docker/                            # Infraestrutura
│   └── nginx/                         # Proxy reverso
│
├── .opencode/                         # Documentação para IA
│   ├── instrucoes.md                  # Auto-carregado pelo opencode
│   ├── PADROES.md                     # Este arquivo
│   └── TEMPLATE-SPEC.md               # Template de spec
│
├── turbo.json                         # Pipeline de tasks
├── docker-compose.yml                 # Dev e Prod
├── tsconfig.base.json                 # Config TS base
├── eslint.config.mjs                  # ESLint flat config
└── .prettierrc                        # Prettier config
```

### Fluxo de dependências

```
apps/web ──HTTP──► apps/api
     ▲                  ▲
     │ importa          │ importa
     └── @monorepo/contracts ◄──┘
         (tipos, enums compartilhados)
```

- `apps/*` dependem de `@monorepo/contracts` para tipos
- `apps/*` **nunca** importam um ao outro
- `packages/contracts` não depende de nenhuma app

---

## 3. Convenções de Nomenclatura

### 3.1 Idioma

| Contexto | Idioma | Exemplos |
|----------|--------|----------|
| Código (API) | Português | `usuario`, `obterPorId`, `cadastrar` |
| Código (Web) | Português | `entrar`, `inicio`, `usaDependencias` |
| Arquivos (API) | Português | `usuario.controller.ts` |
| Arquivos (Web) | Português | `entrar.page.tsx` |
| Contracts | Português | `usuario.types.ts`, `TipoUsuario` |
| Mensagens/erros | Português | `'Preencha todos os campos'` |
| Commits | Português | `feat: adiciona módulo de postagens` |
| Componentes compartilhados | Inglês | `feed.component.tsx` (convenção técnica) |
| Config/Tooling | Inglês | `turbo.json`, `eslint.config.mjs` |

### 3.2 Tabela completa — Backend (apps/api)

| Categoria | Padrão | Exemplo | Idioma |
|-----------|--------|---------|--------|
| Diretório de módulo | `{dominio}/` (plural) | `usuarios/` | PT |
| Entidade | `{entidade}.entity.ts` | `usuario.entity.ts` | PT |
| DTO (criar) | `cadastrar-{entidade}.dto.ts` | `cadastrar-usuario.dto.ts` | PT |
| DTO (atualizar) | `atualizar-{entidade}.dto.ts` | `atualizar-usuario.dto.ts` | PT |
| DTO (entrar/login) | `entrar-{entidade}.dto.ts` | `entrar-usuario.dto.ts` | PT |
| DTO (filtros) | `filtros-{entidade}.dto.ts` | `filtros-usuario.dto.ts` | PT |
| Controller | `{entidade}.controller.ts` | `usuario.controller.ts` | PT |
| Service | `{entidade}.service.ts` | `usuario.service.ts` | PT |
| Module | `{entidade}.module.ts` | `usuario.module.ts` | PT |
| Guard | `{entidade}.guard.ts` | `usuario.guard.ts` | PT |
| Strategy | `{entidade}.strategy.ts` | `usuario.strategy.ts` | PT |
| Seed | `{entidade}.seed.ts` | `usuario.seed.ts` | PT |
| Decorator | `{finalidade}.decorator.ts` | `permissoes.decorator.ts` | PT |
| Enum | `{dominio}.enum.ts` | `rotas.enum.ts` | PT |
| Util | `{finalidade}.util.ts` | `senha.util.ts` | PT |

### 3.3 Tabela completa — Frontend (apps/web)

| Categoria | Padrão | Exemplo | Idioma |
|-----------|--------|---------|--------|
| Diretório de módulo | `{modulo}/` | `entrar/` | PT |
| Página | `{modulo}.page.tsx` | `entrar.page.tsx` | PT |
| ViewModel | `{modulo}.viewmodel.ts` | `entrar.viewmodel.ts` | PT |
| Estilos | `{modulo}.style.css` | `entrar.style.css` | EN (`style`) |
| Componente | `{nome}.component.tsx` | `feed.component.tsx` | EN (`component`) |
| Repositório | `{entidade}.repository.ts` | `usuario.repository.ts` | PT |
| Serviço | `{nome}.service.ts` | `jwt.service.ts` | EN (`service`) |
| Contexto | `{dominio}.context.tsx` | `autenticacao.context.tsx` | PT |
| Interface | `{entidade}-repository.interface.ts` | `usario-repository.interface.ts` | EN |
| Container DI | `container.tsx` | — | — |
| Utilitário | `{finalidade}.util.ts` | `formatador.util.ts` | PT |

### 3.4 Tabela completa — Contracts (packages/contracts)

| Categoria | Padrão | Exemplo |
|-----------|--------|---------|
| Tipos de usuário | `usuario.types.ts` | `Usuario`, `TokenPayload` |
| Tipos de postagem | `postagem.types.ts` | `Postagem`, `CriarPostagemRequest` |
| Tipos de API | `api.types.ts` | `OlaMundoResponse` |
| Enum de papéis | `tipo-usuario.enum.ts` | `TipoUsuario.ADMINISTRADOR` |
| Arquivo barrel | `index.ts` | Re-exports de tudo |

---

## 4. Arquitetura do Backend (NestJS)

### 4.1 Estrutura de módulo

```
src/modules/{dominio}/
├── dtos/
│   ├── cadastrar-{entidade}.dto.ts
│   ├── atualizar-{entidade}.dto.ts   # extends PartialType(CadastrarDto)
│   └── filtros-{entidade}.dto.ts     # opcionais para query
├── entities/
│   └── {entidade}.entity.ts
├── {entidade}.controller.ts
├── {entidade}.service.ts
└── {entidade}.module.ts
```

### 4.2 Padrão de DTO

```typescript
import { IsString, MinLength, MaxLength, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoUsuario } from '@monorepo/contracts';

class CadastrarUsuarioDto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @Transform(({ value }) => value.trim())
    nomeCompleto!: string;

    @IsEmail()
    @Transform(({ value }) => value.toLowerCase().trim())
    email!: string;

    @IsString()
    @MinLength(6)
    senha!: string;

    @IsOptional()
    @IsEnum(TipoUsuario)
    tipo?: TipoUsuario;
}

class AtualizarUsuarioDto extends PartialType(CadastrarUsuarioDto) {}
```

Regras:
- Usar `class-validator` para validação
- Usar `class-transformer` (`@Transform`) para normalização
- Nome em português, sufixo `Dto`
- DTO de atualização usa `PartialType` do `@nestjs/mapped-types`
- Nunca expor a entidade diretamente na resposta

### 4.3 Padrão de Entity

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { TipoUsuario } from '@monorepo/contracts';
import { Tabelas } from '../../../shared/enums/tabelas.enum';

@Entity(Tabelas.USUARIOS)
class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: TipoUsuario, default: TipoUsuario.PADRAO })
    tipo: TipoUsuario;

    @Column({ name: 'nome_completo', unique: true })
    nomeCompleto: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    senha: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}
```

Regras:
- `@Entity` com nome da tabela vindo de `Tabelas.{ENTIDADE}`
- Colunas em `snake_case` no banco (`nome_completo`), `camelCase` no TS
- `@Exclude()` em campos sensíveis (senha)
- `@CreateDateColumn` / `@UpdateDateColumn` com `name` em snake_case

### 4.4 Padrão de Service

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repositorio: Repository<Usuario>,
    ) {}

    async obterTodos(filtros?: FiltrosUsuarioDto): Promise<Usuario[]> { ... }
    async obterPorId(id: number): Promise<Usuario | null> { ... }
    async cadastrar(dto: CadastrarUsuarioDto): Promise<Usuario> { ... }
    async atualizar(id: number, dto: AtualizarUsuarioDto): Promise<Usuario | null> { ... }
    async remover(id: number): Promise<Usuario | null> { ... }
    async entrar(dto: EntrarUsuarioDto): Promise<Usuario | null> { ... }
}
```

Regras:
- Nome dos métodos em português (verbos no infinitivo: `obter`, `cadastrar`, `atualizar`, `remover`)
- Service não lança HTTP exceptions — retorna `| null` e o controller decide
- Injeção direta do `Repository<T>` do TypeORM (sem camada extra de repositório)

### 4.5 Padrão de Controller

```typescript
import { Controller, Get, Post, Body, Param, Query, Patch, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { UsuarioPermissoes, Publico } from '../../../shared/decorators/permissoes.decorator';
import { UsuarioGuard } from '../../../shared/guards/usuario.guard';
import { Rotas } from '../../../shared/enums/rotas.enum';
import { TipoUsuario } from '@monorepo/contracts';

@Controller(Rotas.USUARIOS)
@UseGuards(UsuarioGuard)
class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Publico()
    @Post('entrar')
    async entrar(@Body() dto: EntrarUsuarioDto) { ... }

    @Get()
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async obterTodos(@Query() filtros?: FiltrosUsuarioDto) { ... }

    @Get(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async obterPorId(@Param('id') id: number) { ... }

    @Post()
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async cadastrar(@Body() dto: CadastrarUsuarioDto) { ... }

    @Patch(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async atualizar(@Param('id') id: number, @Body() dto: AtualizarUsuarioDto) { ... }

    @Delete(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async remover(@Param('id') id: number) { ... }
}
```

Regras:
- Controller usa `@Controller(Rotas.{DOMINIO})` — rotas definidas em `rotas.enum.ts`
- `@UseGuards(UsuarioGuard)` no **nível da classe** para proteger todas as rotas
- `@Publico()` em rotas que não precisam autenticação
- `@UsuarioPermissoes(...)` para controle de acesso por papel
- Nomes dos métodos em português, sem sufixo `Controller` nos nomes (o arquivo tem, o método não)

### 4.6 Guard e Strategy

**Strategy** (`usuario.strategy.ts`):
```typescript
@Injectable()
class UsuarioStrategy extends PassportStrategy(Strategy, 'usuario-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.USUARIO_JWT || 'usuario-jwt',
        });
    }

    async validate(payload: TokenPayload): Promise<TokenPayload> {
        return { idUsuario: payload.idUsuario, tipoUsuario: payload.tipoUsuario };
    }
}
```

**Guard** (`usuario.guard.ts`):
- Extende `AuthGuard('usuario-jwt')`
- Lê metadados `PUBLICO_KEY` e `PERMISSOES_KEY` via `Reflector`
- Se rota tem `@Publico()`, permite sem autenticação
- Se rota tem `@UsuarioPermissoes(...)`, valida se `tipoUsuario` do payload está incluído

### 4.7 Shared Enums

```typescript
// shared/enums/rotas.enum.ts
enum Rotas {
    USUARIOS = 'usuarios',
    POSTAGENS = 'postagens',
}

// shared/enums/tabelas.enum.ts
enum Tabelas {
    USUARIOS = 'usuarios',
    POSTAGENS = 'postagens',
}
```

---

## 5. Arquitetura do Frontend (React)

### 5.1 Estrutura de módulo (página)

```
src/modules/{modulo}/
├── {modulo}.page.tsx       # Componente de página
├── {modulo}.viewmodel.ts   # Hook de lógica/estado
└── {modulo}.style.css      # Estilos CSS
```

### 5.2 Padrão de Page

```typescript
import './{modulo}.style.css';
import { useNavigate } from 'react-router-dom';
import { usaDependencias } from '../../shared/di/container';
import { usaAutenticacao } from '../../shared/contexts/autenticacao.context';
import { usa{Nome}ViewModel } from './{modulo}.viewmodel';

function NomePage() {
    const navigate = useNavigate();
    const { payload, isAuthenticated, carregando } = usaAutenticacao();
    const { usuarioRepository } = usaDependencias();

    const {
        // estado e handlers retornados pelo viewmodel
    } = usa{Nome}ViewModel(usuarioRepository, isAuthenticated, ...);

    if (carregando) return null;

    return (
        <div className="{modulo}-layout">
            {/* JSX */}
        </div>
    );
}

export { NomePage };
```

Regras:
- Import do CSS primeiro (side effect)
- `usaAutenticacao()` para auth
- `usaDependencias()` para obter repositórios
- ViewModel recebe repositórios **por parâmetro** (não chama DI internamente)
- Loading state trata com early return `if (carregando) return null`
- Export nomeado: `export { NomePage }`

### 5.3 Padrão de ViewModel

```typescript
import { useState, useEffect, useCallback } from 'react';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usario-repository.interface';
import type { User } from '../../shared/models';
import { JwtService } from '../../shared/services/jwt.service';

function usa{Nome}ViewModel(
    usuarioRepository: UsuarioRepositoryInterface,
    estaAutenticado: boolean,
    idUsuario: number | null,
    aoRedirecionarEntrar: () => void,
) {
    const [usuarioAtual, setUsuarioAtual] = useState<User | null>(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);

    useEffect(() => {
        const buscar = async () => {
            if (estaAutenticado && idUsuario !== null) {
                try {
                    const usuario = await usuarioRepository.obterPorId(idUsuario);
                    setUsuarioAtual(usuario);
                } catch {
                    JwtService.removerToken();
                    aoRedirecionarEntrar();
                }
            } else {
                setUsuarioAtual(null);
            }
            setCarregandoUsuario(false);
        };
        buscar();
    }, [estaAutenticado, idUsuario]);

    const sair = useCallback(() => {
        setUsuarioAtual(null);
        JwtService.removerToken();
        aoRedirecionarEntrar();
    }, [aoRedirecionarEntrar]);

    return { usuarioAtual, carregandoUsuario, sair };
}

export { usa{Nome}ViewModel };
```

Regras:
- Nome da função: `usa{Nome}ViewModel` (prefixo `usa`)
- `function` declaration (não arrow function)
- Export nomeado
- `useEffect` para efeitos colaterais
- `useCallback` para handlers
- **Nunca** chama `usaDependencias()` ou hooks de contexto dentro do viewmodel — recebe tudo por parâmetro
- Operações de token (JWT) via `JwtService` estático

### 5.4 DI Container

```typescript
// shared/di/container.tsx
interface Dependencias {
    postagemRepository: PostagemRepositoryInterface;
    usuarioRepository: UsuarioRepositoryInterface;
}

function DependenciaProvider({ children }: { children: ReactNode }) { ... }
function usaDependencias(): Dependencias { ... }
```

Uso nas páginas:
```typescript
const { usuarioRepository } = usaDependencias();
const { postagemRepository, usuarioRepository } = usaDependencias();
```

**Nunca** destruturar `userRepository` ou `authRepository` — os nomes corretos são `usuarioRepository` e `postagemRepository`.

### 5.5 Contexto de Autenticação

```typescript
// shared/contexts/autenticacao.context.tsx
interface AutenticacaoContextType {
    payload: TokenPayload | null;
    carregando: boolean;
    isAuthenticated: boolean;
    sair: () => void;
}

function AutenticacaoProvider({ children }) { ... }
function usaAutenticacao(): AutenticacaoContextType { ... }

export { AutenticacaoProvider, usaAutenticacao };
```

Retorna:
- `payload` — dados decodificados do JWT (`{ idUsuario, tipoUsuario }`)
- `carregando` — true enquanto verifica token
- `isAuthenticated` — derivado de `!!payload`
- `sair` — limpa token e estado

### 5.6 Componentes Compartilhados

```
shared/components/{nome}/
├── {nome}.component.tsx    # Componente React
├── {nome}.viewmodel.ts     # (opcional) Hook interno
└── {nome}.style.css        # Estilos
```

Regras:
- Nome do diretório e arquivo em inglês, kebab-case
- Props tipadas com interface no mesmo arquivo
- Não acessam contexto diretamente — recebem dados por props
- Export nomeado

### 5.7 Repositórios

```typescript
// shared/repositories/usuario.repository.ts
class UsuarioRepository implements UsuarioRepositoryInterface {
    async obterPorId(id: number): Promise<User> {
        return api.get<User>(`usuarios/${id}`);
    }
    async entrar(email: string, senha: string): Promise<string> { ... }
    async cadastrar(dados: CadastrarUsuarioRequest): Promise<User> { ... }
    async atualizar(id: number, dados: AtualizarUsuarioRequest): Promise<User> { ... }
    async remover(id: number): Promise<void> { ... }
}
```

- Nome dos métodos em português
- Usa `ApiService` (singleton `api`) para chamadas HTTP
- Retorna tipos de `@monorepo/contracts`

### 5.8 ApiService

```typescript
// shared/services/api.service.ts
// Singleton que encapsula axios com:
// - Base URL de VITE_API_URL
// - Interceptor para adicionar token JWT no header
// - Interceptor para tratar erros 401
```

---

## 6. Contratos Compartilhados

`packages/contracts/` é o **ponto único de verdade** para tipos compartilhados.

### 6.1 Tipos de Usuário

```typescript
// packages/contracts/src/types/usuario.types.ts
interface Usuario {
    id: number;
    nomeCompleto: string;
    email: string;
    tipo: TipoUsuario;
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
}

interface UsuarioSemSenha extends Omit<Usuario, 'senha'> {}
interface CadastrarUsuarioRequest { nomeCompleto: string; email: string; senha: string; tipo?: TipoUsuario; }
interface AtualizarUsuarioRequest extends Partial<Omit<CadastrarUsuarioRequest, 'email'>> {}
interface EntrarUsuarioRequest { email: string; senha: string; }
interface EntrarUsuarioResponse { token_usuario: string; }
interface FiltrosUsuarioRequest { nome?: string; tipo?: TipoUsuario; ativo?: boolean; }
interface TokenPayload { idUsuario: number; tipoUsuario: number; }
```

### 6.2 Tipos de Postagem

```typescript
// packages/contracts/src/types/postagem.types.ts
interface Postagem { id: number; conteudo: string; tags: string[]; ... }
interface PostagemFeed extends Postagem { autor: UsuarioSemSenha; ... }
interface CriarPostagemRequest { conteudo: string; tags: string[]; }
interface AtualizarPostagemRequest { conteudo?: string; tags?: string[]; }
```

### 6.3 Enums

```typescript
// packages/contracts/src/enums/tipo-usuario.enum.ts
enum TipoUsuario {
    ADMINISTRADOR = 0,
    PADRAO = 1,
}
```

### 6.4 Como importar

```typescript
// No backend (NestJS)
import { Usuario, TipoUsuario, TokenPayload } from '@monorepo/contracts';

// No frontend (React) — type-only import para não bundlar
import type { Usuario, TokenPayload } from '@monorepo/contracts';
import { TipoUsuario } from '@monorepo/contracts'; // enum precisa de value import
```

### 6.5 package.json (exports)

```json
{
    "name": "@monorepo/contracts",
    "main": "./src/index.ts",
    "types": "./src/index.ts",
    "exports": {
        ".": "./src/index.ts",
        "./types/usuario": "./src/types/usuario.types.ts",
        "./types/postagem": "./src/types/postagem.types.ts",
        "./types/api": "./src/types/api.types.ts",
        "./enums/papeis-usuario": "./src/enums/tipo-usuario.enum.ts"
    }
}
```

---

## 7. Roteamento

### 7.1 Backend (API)

Rotas centralizadas em `shared/enums/rotas.enum.ts`:
```typescript
enum Rotas {
    USUARIOS = 'usuarios',
    POSTAGENS = 'postagens',
}
```

Controllers usam `@Controller(Rotas.{DOMINIO})`.

### 7.2 Frontend (React Router)

`app/rotiador.tsx`:
```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';

const rotiador = createBrowserRouter([
    { path: '/',              element: <InicioPage /> },
    { path: '/entrar',        element: <EntrarPage /> },
    { path: '/registrar-se',  element: <RegistrarSePage /> },
    { path: '*',              element: <Navigate to="/" replace /> },
]);
```

Regras:
- Arquivo chamado `rotiador.tsx` (português)
- Rotas planas (sem aninhamento por enquanto)
- Catch-all redireciona para `/`

---

## 8. Autenticação e Autorização

### 8.1 Fluxo

```
[Frontend]                    [Backend]
    │                             │
    │  POST /usuarios/entrar      │
    │  { email, senha }           │
    │ ─────────────────────────►  │
    │                             │── verifica credenciais
    │                             │── gera JWT
    │  { token_usuario }          │
    │ ◄─────────────────────────  │
    │                             │
    │── JwtService.definirToken() │
    │── redireciona para /        │
```

### 8.2 Backend

- `UsuarioStrategy`: Passport JWT strategy que extrai token do header `Authorization: Bearer`
- `UsuarioGuard`: Guard que verifica JWT e permissões
- `@Publico()`: decorator para rotas públicas (login, registro)
- `@UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)`: restringe por papel

### 8.3 Frontend

- `JwtService`: gerencia token em cookie (`js-cookie`) — `definirToken()`, `removerToken()`, `obterToken()`
- `AutenticacaoProvider`: lê token ao montar, decodifica, expõe contexto
- `usaAutenticacao()`: hook para consumir estado de autenticação

---

## 9. Configurações do Projeto

### 9.1 TypeScript

`tsconfig.base.json` (base para todos):
- `target: ES2022`, `module: CommonJS`, `strict: true`
- `emitDecoratorMetadata: true`, `experimentalDecorators: true`
- `composite: true`, `incremental: true`

### 9.2 ESLint (`eslint.config.mjs`)

- Flat config com 3 blocos: `apps/api`, `apps/web`, `packages/contracts`
- Regras: `@typescript-eslint/no-explicit-any: off`, `no-unused-vars` com `^_`
- Prettier integrado

### 9.3 Prettier (`.prettierrc`)

```json
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 4,
    "useTabs": false,
    "trailingComma": "es5",
    "printWidth": 200,
    "endOfLine": "crlf"
}
```

### 9.4 Turbo (`turbo.json`)

```json
{
    "tasks": {
        "build": { "dependsOn": ["^build"], "outputs": ["../../dist/**"], "inputs": ["src/**", "tsconfig.json", "package.json"] },
        "dev": { "cache": false, "persistent": true, "dependsOn": ["^build"] },
        "lint": { "dependsOn": ["^build"] },
        "test": { "dependsOn": ["build"], "inputs": ["src/**", "tests/**"] }
    }
}
```

---

## 10. Testes

### 10.1 Configuração

- Jest + ts-jest
- Test environment: `jsdom`
- Test match: `**/tests/**/*.spec.ts`, `**/tests/**/*.spec.tsx`
- Mock de fetch global (`globalThis.fetch`) para testes no frontend

### 10.2 Localização

```
apps/api/tests/             # Testes do backend
apps/web/tests/             # Testes do frontend
```

### 10.3 Nomenclatura

```
{arquivo}.spec.ts           # Teste de unidade
```

### 10.4 Padrão de teste (backend)

```typescript
describe('UsuarioService', () => {
    it('deve retornar usuário quando id existe', async () => { ... });
    it('deve lançar exceção quando id não existe', async () => { ... });
});
```

- Testar **service** (lógica de negócio) > controller (integração)
- Mockar `Repository<T>` do TypeORM com `mockRepository`
- Usar `describe` / `it` em português

### 10.5 Padrão de teste (frontend)

```typescript
describe('App', () => {
    it('deve renderizar sem erros', async () => {
        render(<App />);
        await waitFor(() => { expect(true).toBe(true); });
    });
});
```

- `@testing-library/react` para renderizar componentes
- `waitFor` para operações assíncronas
- Mockar chamadas de API antes dos testes (`beforeAll`)

---

## 11. Git Workflow

### 11.1 Nomenclatura de branch

```
{tipo}/{descricao-em-portugues}
```

| Tipo | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat/modulo-postagens` |
| `fix` | Correção de bug | `fix/corrige-login-email` |
| `refactor` | Refatoração | `refactor/renomeia-viewmodel` |
| `docs` | Documentação | `docs/adiciona-padroes` |
| `chore` | Manutenção | `chore/atualiza-deps` |

### 11.2 Formato de commit

```
{tipo}: {mensagem em português no imperativo}
```

Exemplos:
```
feat: adiciona módulo de postagens
fix: corrige validação de email no cadastro
refactor: renomeia UsuarioRole para TipoUsuario
docs: adiciona seção de CSS conventions
```

Regras:
- Primeira linha com no máximo 72 caracteres
- Corpo opcional com detalhes após linha em branco
- Menções a issues: `refs #123` ou `closes #123`

### 11.3 Fluxo de PR

1. Branch a partir de `main`
2. Implementar em commits atômicos
3. Abrir PR com descrição do que foi feito
4. Squash merge ao aprovar

---

## 12. CSS Conventions

### 12.1 Organização

- CSS puro (sem CSS Modules, sem Tailwind, sem styled-components)
- Cada módulo/página tem seu próprio `{modulo}.style.css`
- Componentes compartilhados têm seu próprio `{nome}.style.css`
- Tema escuro global definido em `inicio.style.css` via variáveis `:root`

### 12.2 Nomenclatura de classes

- **kebab-case** para nomes de classe
- Prefixo com o nome do componente para evitar conflitos

```css
/* ✅ Correto */
.feed-column { ... }
.feed-header { ... }
.compose-submit-btn { ... }
.sidebar-user-name { ... }
.post-like-btn.active { ... }

/* ❌ Evitar */
.FeedColumn { ... }
.feed_column { ... }
.btn { ... }  /* muito genérico */
```

### 12.3 Variáveis CSS

Definidas em `:root` no `inicio.style.css`:

```css
:root {
    --bg:           #0d1117;
    --surface:      #161b22;
    --border:       #30363d;
    --ink:          #e6edf3;
    --accent:       #4d8c6e;
    --radius:       6px;
    --sidebar-w:    220px;
    --feed-w:       640px;
    --font-ui:      'Syne', sans-serif;
    --font-body:    'Lora', Georgia, serif;
}
```

Regras:
- Usar variáveis em vez de valores literais
- Nunca duplicar definição de variáveis — estão centralizadas
- Criar novas variáveis em `:root` no `inicio.style.css` quando necessário

### 12.4 Responsivo

```css
@media (max-width: 960px) { ... }
@media (max-width: 640px) { ... }
```

- Breakpoints: 960px (tablet), 640px (mobile)
- Mobile-first: base é desktop, media queries reduzem

---

## 13. Error Handling

### 13.1 Backend (NestJS)

| Situação | Exception | HTTP Status |
|----------|-----------|-------------|
| Recurso não encontrado | `NotFoundException` | 404 |
| Credenciais inválidas | `UnauthorizedException` | 401 |
| Sem permissão | `ForbiddenException` | 403 |
| Erro interno | `InternalServerErrorException` | 500 |
| Dado inválido | `BadRequestException` (class-validator) | 400 |

Regras:
- Service retorna `| null`, exception é lançada no controller
- `class-validator` trata validação de DTOs automaticamente (400)
- `UsuarioGuard` trata 401/403 automaticamente

### 13.2 Frontend (React)

| Situação | Tratamento |
|----------|------------|
| Loading | `if (carregando) return null` no page |
| Erro na requisição | `try/catch` no viewmodel, estado `mensagemErro` |
| Token expirado | `JwtService.removerToken()` + redirecionar para `/entrar` |
| Empty state | Renderizar mensagem "Nenhum resultado" no componente |

Padrão de viewmodel com erro:

```typescript
const [dado, setDado] = useState<Tipo | null>(null);
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState<string | null>(null);

useEffect(() => {
    const buscar = async () => {
        try {
            const resultado = await repositorio.obterTodos();
            setDado(resultado);
        } catch (e: any) {
            setErro(e.message || 'Erro ao carregar');
        }
        setCarregando(false);
    };
    buscar();
}, []);
```

---

## 14. State Management

### 14.1 Padrão principal: ViewModel hooks

Cada página tem seu próprio hook `usa{Nome}ViewModel` que:
- Gerencia estado local com `useState`
- Efeitos colaterais com `useEffect`
- Handlers memoizados com `useCallback`
- Recebe dependências por parâmetro (repositórios, callbacks)

### 14.2 Estado global: React Context

Usado apenas para:
- `AutenticacaoContext` — estado de autenticação (payload, carregando, sair)
- `DependenciaProvider` — DI de repositórios

Regras:
- **Nunca** criar novos Contexts para estado de UI
- **Nunca** usar bibliotecas externas de estado (Redux, Zustand, etc.)
- Estado de formulário é local no viewmodel ou no componente
- Estado de cache (dados da API) é local no viewmodel e refetch quando necessário

### 14.3 Comunicação entre componentes

- Pai → filho: props
- Filho → pai: callbacks nas props
- Entre páginas: não há (rotas diferentes)
- Dados compartilhados: repositórios (sempre buscam da API)

---

## 15. NPM Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Sobe API + Web em paralelo via Turborepo |
| `npm run dev:api` | Apenas a API (`turbo dev --filter=@monorepo/api`) |
| `npm run dev:web` | Apenas o frontend (`turbo dev --filter=@monorepo/web`) |
| `npm run build` | Compila todos os pacotes com cache |
| `npm run lint` | ESLint em todo o código |
| `npm run test` | Roda Jest em todos os workspaces |
| `npm run test:watch` | Jest em modo watch |
| `npm run test:cov` | Jest com cobertura |
| `npm run format` | Prettier em todo o código |
| `npm run format:check` | Prettier apenas verificando |

---

## 16. Pitfalls Comuns

### ❌ Erros de DI (frontend)

```typescript
// ERRADO — esses nomes não existem no container
const { userRepository, authRepository } = usaDependencias();

// CERTO
const { usuarioRepository } = usaDependencias();
const { postagemRepository, usuarioRepository } = usaDependencias();
```

### ❌ Hook de auth errado

```typescript
// ERRADO — useAuth não existe
import { useAuth } from '../../shared/contexts/autenticacao.context';

// CERTO
import { usaAutenticacao } from '../../shared/contexts/autenticacao.context';
const { payload, isAuthenticated, carregando } = usaAutenticacao();
```

### ❌ Nomes de método errados

```typescript
// ERRADO — getById não existe na interface
const user = await userRepository.getById(id);

// CERTO
const usuario = await usuarioRepository.obterPorId(id);
```

### ❌ DI dentro do viewmodel

```typescript
// ERRADO — viewmodel não deve chamar DI
function usaInicioViewModel() {
    const { usuarioRepository } = usaDependencias();
}

// CERTO — recebe por parâmetro
function usaInicioViewModel(usuarioRepository: UsuarioRepositoryInterface) { }
```

### ❌ ViewModel sem prefixo usa

```typescript
// ERRADO
export function useInicioViewModel() { }
export { useInicioViewModel };

// CERTO
function usaInicioViewModel() { }
export { usaInicioViewModel };
```

### ❌ Export de página

```typescript
// ERRADO — default export
export default function Pagina() {}

// CERTO — named export
function Pagina() {}
export { Pagina };
```

### ❌ DTO sem class-validator

```typescript
// ERRADO — sem validação
class CriarDto { nome!: string; }

// CERTO — com validação
class CriarDto {
    @IsString()
    @MinLength(3)
    nome!: string;
}
```

---

## 17. Fluxo de Criação de Módulo

### 11.1 Criar um módulo no backend

1. Adicionar rota em `shared/enums/rotas.enum.ts`
2. Adicionar tabela em `shared/enums/tabelas.enum.ts`
3. Criar entidade em `modules/{dominio}/entities/{entidade}.entity.ts`
4. Criar DTOs em `modules/{dominio}/dtos/`
5. Criar service em `modules/{dominio}/{entidade}.service.ts`
6. Criar controller em `modules/{dominio}/{entidade}.controller.ts`
7. Criar module em `modules/{dominio}/{entidade}.module.ts`
8. Importar módulo em `app.module.ts`
9. Adicionar tipos em `packages/contracts/`
10. (Opcional) Criar seed em `data/seeds/`

### 11.2 Criar um módulo no frontend

1. Criar diretório em `modules/{modulo}/`
2. Criar `{modulo}.page.tsx` com componente de página
3. Criar `{modulo}.viewmodel.ts` com hook de estado
4. Criar `{modulo}.style.css` com estilos
5. Adicionar rota em `app/rotiador.tsx`
6. (Se necessário) Criar/adicionar repositório em `shared/repositories/`
7. (Se necessário) Criar/adicionar interface em `shared/interfaces/`

---

## Glossário de Termos Recorrentes

| Português | Contexto | Ingês (se aplicável) |
|-----------|----------|---------------------|
| usuário | Entidade, domínio | user |
| postagem | Entidade, domínio | post |
| entrar | Ação de login | login / sign in |
| sair | Ação de logout | logout |
| registrar-se | Ação de cadastro | sign up / register |
| cadastrar | Criar recurso | create |
| atualizar | Alterar recurso | update |
| remover | Deletar recurso | delete |
| obter | Buscar recurso(s) | get / fetch |
| permissão | Regra de acesso | permission |
| papel | Tipo de usuário | role |
| guard | Middleware de autenticação | guard |
| viewmodel | Hook de estado/lógica | viewmodel |
| rota | Caminho da URL | route |
| roteador | Roteador (router) | router |
| dependência | Serviço injetado | dependency |
| repositório | Camada de dados | repository |
