# Módulo: Usuário

## Visão geral

Módulo de autenticação e gerenciamento de usuários. Permite cadastro, login, listagem, edição, desativação e remoção de contas. Utiliza JWT para autenticação e bcrypt para hash de senha.

---

## Contracts (`packages/contracts/src/`)

### Enums

| Enum | Arquivo | Valores |
|------|---------|---------|
| `TipoUsuario` | `enums/tipo-usuario.enum.ts` | `ADMINISTRADOR = 0`, `PADRAO = 1` |

### Types (`types/usuario.types.ts`)

| Interface | Descrição |
|-----------|-----------|
| `Usuario` | Entidade completa com `senha` |
| `UsuarioSemSenha` | `Omit<Usuario, 'senha'>` |
| `CadastrarUsuarioRequest` | Payload de criação |
| `AtualizarUsuarioRequest` | Payload de atualização |
| `EntrarUsuarioRequest` | Payload de login |
| `EntrarUsuarioResponse` | `{ token_usuario: string }` |
| `FiltrosUsuarioRequest` | Filtros de listagem |
| `TokenPayload` | `{ idUsuario: number; tipoUsuario: number }` |

---

## Backend (`apps/api/src/modules/usuarios/`)

### Entidade

**Arquivo:** `entities/usuario.entity.ts`

| Coluna | Tipo | Atributos |
|--------|------|-----------|
| `id` | `number` | `@PrimaryGeneratedColumn()` |
| `tipo` | `TipoUsuario` | `@Column({ enum: TipoUsuario, default: TipoUsuario.PADRAO })` |
| `nomeCompleto` | `string` | `@Column({ name: 'nome_completo', unique: true })` |
| `email` | `string` | `@Column({ unique: true })` |
| `senha` | `string` | `@Column()`, `@Exclude()` |
| `ativo` | `boolean` | `@Column({ default: true })` |
| `criadoEm` | `Date` | `@CreateDateColumn({ name: 'criado_em' })` |
| `atualizadoEm` | `Date` | `@UpdateDateColumn({ name: 'atualizado_em' })` |

### DTOs

#### `dtos/cadastrar-usuario.dto.ts`
- `nomeCompleto` — `@IsString()`, `@MinLength(3)`, `@MaxLength(255)`, `@Transform(trim)`
- `email` — `@IsEmail()`, `@Transform(lowercase + trim)`
- `senha` — `@IsString()`, `@MinLength(8)`, `@MaxLength(100)`
- `tipo?` — `@IsEnum(TipoUsuario)`, `@IsOptional()`
- `ativo?` — `@IsBoolean()`, `@IsOptional()`

#### `dtos/atualizar-usuario.dto.ts`
- `extends PartialType(CadastrarUsuarioDto)`
- `tipo?` — `@IsOptional()`, `@IsEnum(TipoUsuario)`
- `ativo?` — `@IsOptional()`, `@IsBoolean()`

#### `dtos/entrar-usuario.dto.ts`
- `email` — `@IsEmail()`, `@Transform(lowercase + trim)`
- `senha` — `@IsString()`, `@MaxLength(100)`

#### `dtos/filtros-usuario.dto.ts`
- `nomeCompleto?` — `@IsString()`, `@MinLength(3)`
- `email?` — `@IsEmail()`
- `tipo?` — `@IsEnum(TipoUsuario)`
- `ativo?` — `@IsBoolean()`, `@Type(() => Boolean)`

### Service (`usuario.service.ts`)

| Método | Parâmetros | Retorno | Descrição |
|--------|-----------|---------|-----------|
| `obterTodos` | `filtros?: FiltrosUsuarioDto` | `Promise<Usuario[]>` | Lista com filtros opcionais (nome, email, tipo, ativo) |
| `obterPorId` | `id: number` | `Promise<Usuario \| null>` | Busca por ID |
| `obterPorEmail` | `email: string` | `Promise<Usuario \| null>` | Busca por email |
| `cadastrar` | `dto: CadastrarUsuarioDto` | `Promise<Usuario \| null>` | Cria usuário com senha hasheada; retorna `null` se email já existe |
| `atualizar` | `id: number, dto: AtualizarUsuarioDto` | `Promise<Usuario \| null>` | Atualiza dados; `ConflictException` se email já em uso |
| `remover` | `id: number` | `Promise<Usuario \| null>` | Remove do banco |
| `entrar` | `dto: EntrarUsuarioDto` | `Promise<Usuario \| null>` | Valida credenciais |
| `desativarConta` | `id: number` | `Promise<Usuario \| null>` | Seta `ativo = false` |

**Regras:**
- Senha hasheada com `SenhaUtil.gerarHash()` (bcrypt)
- Métodos retornam `null` em vez de lançar exceções (controller converte)
- `obterPorEmail` usado internamente para validar unicidade

### Controller (`usuario.controller.ts`)

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| `POST` | `/usuarios/entrar` | `@Publico()` | Login → retorna `{ token_usuario }` |
| `POST` | `/usuarios/registrar-se` | `@Publico()` | Cadastro público → retorna usuário sem senha |
| `PATCH` | `/usuarios/:id/desativar` | `@UsuarioPermissoes(ADMIN, PADRAO)` | Desativa própria conta |
| `GET` | `/usuarios` | `@UsuarioPermissoes(ADMIN, PADRAO)` | Lista todos (com filtros) |
| `GET` | `/usuarios/:id` | `@UsuarioPermissoes(ADMIN, PADRAO)` | Busca por ID |
| `POST` | `/usuarios` | `@UsuarioPermissoes(ADMIN)` | Admin cria usuário |
| `PATCH` | `/usuarios/:id` | `@UsuarioPermissoes(ADMIN, PADRAO)` | Atualiza dados |
| `DELETE` | `/usuarios/:id` | `@UsuarioPermissoes(ADMIN)` | Remove usuário |

**Regras:**
- Controller usa `@UseGuards(UsuarioGuard)` no nível da classe
- Rotas públicas com `@Publico()` (entrar, registrar-se)
- Senha sempre excluída da resposta via `Omit<Usuario, 'senha'>`
- Tratamento de exceções: `NotFoundException`, `ConflictException`, `UnauthorizedException`

### Module (`usuario.module.ts`)

```typescript
@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        JwtModule.registerAsync({ secret: configService.getOrThrow('USUARIO_JWT'), signOptions: { expiresIn: '1h' } }),
        PassportModule,
    ],
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioGuard, UsuarioStrategy],
    exports: [UsuarioService, UsuarioGuard],
})
```

---

## Frontend (`apps/web/src/`)

### Autenticação

| Peça | Arquivo | Descrição |
|------|---------|-----------|
| `AutenticacaoProvider` | `shared/contexts/autenticacao.context` | Provider React com `usaAutenticacao()` → `{ payload, carregando, isAuthenticated, sair }` |
| `UsuarioGuard` (web) | `shared/guards/usuario.guard` | Protege rotas privadas |

### Páginas

#### Entrar (`modules/entrar/`)

| Arquivo | Descrição |
|---------|-----------|
| `entrar.page.tsx` | Formulário de login (email + senha) |
| `entrar.viewmodel.ts` | Hook `usaEntrarViewModel(usuarioRepository, definirAutenticacao)` — estado: `email, senha, mensagemErro, carregando` |
| `entrar.style.css` | Estilos do formulário |

- Rota: `/entrar`
- Chama `usuarioRepository.entrar(email, senha)` → recebe token → chama `definirAutenticacao(token)` → navega para `/`

#### Registrar-se (`modules/registrar-se/`)

| Arquivo | Descrição |
|---------|-----------|
| `registrar-se.page.tsx` | Formulário de cadastro (nome, email, senha, confirmar senha) |
| `registrar-se.viewmodel.ts` | Hook `usaRegistrarSeViewModel(usuarioRepository, definirAutenticacao)` — estado: `nome, email, senha, confirmarSenha, mensagemErro, carregando` |
| *(sem style próprio, herda de entrar)* | |

- Rota: `/registrar-se`
- Valida client-side: email regex, senha >= 6, senhas coincidem
- Chama `usuarioRepository.registrarSe(dados)` → `usuarioRepository.entrar(email, senha)` → autentica automaticamente

#### Perfil (dialog dentro de `modules/inicio/`)

| Arquivo | Descrição |
|---------|-----------|
| `dialogs/perfil-dialog.tsx` | Modal de perfil: visualizar/editar nome e email, desativar conta |
| `dialogs/perfil-dialog.viewmodel.ts` | Hook `usaPerfilDialogViewModel(usuarioRepository, user, onUpdate, onClose, onDelete)` — estado: `editando, formData, loading, error` |
| `dialogs/perfil-dialog.style.css` | Estilos do modal |

- Acessado via feed principal (`InicioPage`)
- Modo visualização → modo edição (alterna com botão "Editar")
- Salva via `usuarioRepository.atualizar(id, dados)`
- Desativa via `usuarioRepository.desativar(id)` com confirmação

### Repositório (`shared/repositories/usuario.repository.ts`)

| Método | Descrição |
|--------|-----------|
| `entrar(email, senha)` | `POST /usuarios/entrar` → retorna `token_usuario` |
| `registrarSe(dados)` | `POST /usuarios/registrar-se` |
| `obterTodos(filtros?)` | `GET /usuarios` |
| `obterPorId(id)` | `GET /usuarios/:id` |
| `cadastrar(dados)` | `POST /usuarios` |
| `atualizar(id, dados)` | `PATCH /usuarios/:id` |
| `remover(id)` | `DELETE /usuarios/:id` |
| `desativar(id)` | `PATCH /usuarios/:id/desativar` |

### Interface (`shared/interfaces/usuario-repository.interface.ts`)

Contrato que define todos os métodos acima, implementado por `UsuarioRepository`.

---

## Registros centrais

| Arquivo | Chave |
|---------|-------|
| `shared/enums/rotas.enum.ts` | `Rotas.USUARIOS = 'usuarios'` |
| `shared/enums/tabelas.enum.ts` | `Tabelas.USUARIOS = 'usuarios'` |
| `app.module.ts` | Importa `UsuarioModule` |

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `USUARIO_JWT` | Chave secreta para assinatura dos tokens JWT |

---

## Fluxos principais

### Login
1. Usuário preenche email + senha em `EntrarPage`
2. `usaEntrarViewModel` chama `usuarioRepository.entrar(email, senha)`
3. Backend valida credenciais em `UsuarioService.entrar()`
4. Se válido, gera JWT com `{ idUsuario, tipoUsuario }` e retorna
5. Frontend salva token via `AutenticacaoProvider` e redireciona para `/`

### Cadastro
1. Usuário preenche nome, email, senha em `RegistrarSePage`
2. `usaRegistrarSeViewModel` valida client-side e chama `usuarioRepository.registrarSe(dados)`
3. Backend cria usuário com senha hasheada
4. Frontend faz login automático e redireciona para `/`

### Gerenciamento (admin)
1. Admin acessa lista de usuários via `GET /usuarios` (com filtros opcionais)
2. Admin pode criar (`POST /usuarios`), editar (`PATCH /usuarios/:id`), remover (`DELETE /usuarios/:id`)
3. Usuário comum pode editar próprio perfil e desativar própria conta
