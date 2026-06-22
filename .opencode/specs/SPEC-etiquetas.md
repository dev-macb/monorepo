# Spec: Módulo de Etiquetas

## Contexto

Posts precisam de etiquetas (tags) categorizáveis. Em vez de `string[]` soltas no modelo atual, etiquetas serão uma entidade própria com relacionamento muitos-para-muitos com postagens no futuro.

## Comportamento esperado

- Criar, listar, buscar por ID, atualizar e remover etiquetas
- Nome da etiqueta deve ser único
- Etiquetas são gerenciáveis por administradores; usuários comuns podem listar
- Relacionamento ManyToMany com Postagem será adicionado quando o módulo de postagens for criado

## Arquivos afetados

- `packages/contracts/src/types/etiqueta.types.ts` — tipo `Etiqueta`
- `packages/contracts/src/index.ts` — export novo
- `apps/api/src/modules/etiquetas/` — módulo completo
- `apps/api/src/shared/enums/rotas.enum.ts` — `Rotas.ETIQUETAS`
- `apps/api/src/shared/enums/tabelas.enum.ts` — `Tabelas.ETIQUETAS`
- `apps/api/src/app.module.ts` — importar `EtiquetaModule`

## Padrão a seguir

Seguir o mesmo padrão do módulo `usuarios/` (entity, DTOs, service, controller, module) conforme skill `criar-modulo-api`.

## Especificação técnica

### Backend

#### Endpoints

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| GET | `/etiquetas` | `@Publico()` | Listar todas |
| GET | `/etiquetas/:id` | `@Publico()` | Obter por ID |
| POST | `/etiquetas` | `@UsuarioPermissoes(ADMIN)` | Criar |
| PATCH | `/etiquetas/:id` | `@UsuarioPermissoes(ADMIN)` | Atualizar |
| DELETE | `/etiquetas/:id` | `@UsuarioPermissoes(ADMIN)` | Remover |

#### Entidade `Etiqueta`

| Coluna | Tipo | Atributos |
|--------|------|-----------|
| `id` | `number` | `@PrimaryGeneratedColumn()` |
| `nome` | `string` | `@Column({ unique: true })`, `@MinLength(2)`, `@MaxLength(50)` |
| `criadoEm` | `Date` | `@CreateDateColumn()` |
| `atualizadoEm` | `Date` | `@UpdateDateColumn()` |

#### DTOs

- **`CriarEtiquetaDto`**: `nome` — `@IsString()`, `@MinLength(2)`, `@MaxLength(50)`, `@Transform(trim)`
- **`AtualizarEtiquetaDto`**: `extends PartialType(CriarEtiquetaDto)`

#### Service

| Método | Retorno |
|--------|---------|
| `criar(dto)` | `Promise<Etiqueta \| null>` (null se nome duplicado) |
| `obterTodos()` | `Promise<Etiqueta[]>` |
| `obterPorId(id)` | `Promise<Etiqueta \| null>` |
| `atualizar(id, dto)` | `Promise<Etiqueta \| null>` |
| `remover(id)` | `Promise<Etiqueta \| null>` |

#### Controller

Mesmo padrão de `UsuarioController`:
- `@UseGuards(UsuarioGuard)` na classe
- `@Publico()` em GETs
- `@UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)` em POST, PATCH, DELETE

### Contracts

#### `types/etiqueta.types.ts`

```typescript
export interface Etiqueta {
    id: number;
    nome: string;
    criadoEm: string;
    atualizadoEm: string;
}

export interface CriarEtiquetaRequest {
    nome: string;
}

export interface AtualizarEtiquetaRequest {
    nome?: string;
}
```

### Mock / Exemplo de uso

```typescript
// Criar
POST /etiquetas { "nome": "typescript" }
// → { "id": 1, "nome": "typescript", "criadoEm": "...", "atualizadoEm": "..." }

// Listar
GET /etiquetas
// → [{ "id": 1, "nome": "typescript", ... }]
```

## Critérios de aceite

- [ ] CRUD completo de etiquetas funcionando
- [ ] Nome único validado (retorna null / ConflictException no controller)
- [ ] Build sem erros
- [ ] Apenas admin pode criar/editar/remover
- [ ] Qualquer um pode listar/buscar

## Observações

- Relacionamento ManyToMany com `Postagem` será adicionado posteriormente via tabela `postagem_etiqueta`
- Nenhuma alteração no tipo `Postagem` existente por enquanto
