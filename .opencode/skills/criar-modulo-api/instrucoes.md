# Skill: Criar Módulo na API

Use esta skill ao criar um novo módulo de domínio no NestJS.
Siga os passos abaixo na ordem, consultando o módulo `usuarios/` como referência.

---

## 1. Planejamento

Defina com o usuário:
- Nome do domínio (ex: `postagens`, `comentarios`)
- Nome da entidade (ex: `Postagem`, `Comentario`)
- Rotas CRUD necessárias
- Campos da entidade
- Regras de autenticação (pública vs protegida)
- Tipos novos em `@monorepo/contracts`

---

## 2. Contracts

Se o domínio precisa de tipos compartilhados:

```
packages/contracts/src/types/{dominio}.types.ts
```

Criar interfaces seguindo o padrão:
- `{Entidade}` — interface principal
- `Criar{Entidade}Request` — payload de criação
- `Atualizar{Entidade}Request` — payload de atualização
- `Filtros{Entidade}Request` — (opcional) filtros de query

Atualizar `packages/contracts/src/index.ts` e `packages/contracts/package.json` (se necessário).

---

## 3. Registros centrais

### `apps/api/src/shared/enums/rotas.enum.ts`

```typescript
enum Rotas {
    // ... existentes
    POSTAGENS = 'postagens',
}
```

### `apps/api/src/shared/enums/tabelas.enum.ts`

```typescript
enum Tabelas {
    // ... existentes
    POSTAGENS = 'postagens',
}
```

---

## 4. Estrutura de diretório

Criar: `apps/api/src/modules/{dominio}/`

```
{dominio}/
├── dtos/
│   ├── criar-{entidade}.dto.ts
│   └── atualizar-{entidade}.dto.ts   # extends PartialType(CriarDto)
├── entities/
│   └── {entidade}.entity.ts
├── {entidade}.controller.ts
├── {entidade}.service.ts
└── {entidade}.module.ts
```

---

## 5. Entidade

Seguir o padrão de `usuario.entity.ts`:

```typescript
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tabelas } from '../../../shared/enums/tabelas.enum';

@Entity(Tabelas.{DOMINIO_MAIUSCULO})
class {Entidade} {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nome: string;

    // ... outros campos

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}

export { {Entidade} };
```

Regras:
- `@Entity` com nome da tabela vindo de `Tabelas.{DOMINIO}`
- Colunas em `snake_case` no banco, `camelCase` no TS
- `@CreateDateColumn` / `@UpdateDateColumn` sempre
- Relacionamentos com `@ManyToOne`, `@JoinColumn`

---

## 6. DTOs

### `criar-{entidade}.dto.ts`

```typescript
import { Transform } from 'class-transformer';
import { IsString, MinLength, MaxLength } from 'class-validator';

class Criar{Entidade}Dto {
    @IsString()
    @MinLength(3)
    @MaxLength(255)
    @Transform(({ value }) => value.trim())
    nome!: string;
    // ... outros campos com validação
}

export { Criar{Entidade}Dto };
```

### `atualizar-{entidade}.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { Criar{Entidade}Dto } from './criar-{entidade}.dto';

class Atualizar{Entidade}Dto extends PartialType(Criar{Entidade}Dto) {}

export { Atualizar{Entidade}Dto };
```

Regras:
- `class-validator` para validação
- `class-transformer` `@Transform` para normalização
- `PartialType` para DTO de atualização

---

## 7. Service

Seguir o padrão de `usuario.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
class {Entidade}Service {
    constructor(
        @InjectRepository({Entidade})
        private readonly repositorio: Repository<{Entidade}>,
    ) {}

    async criar(dto: Criar{Entidade}Dto): Promise<{Entidade}> { ... }
    async obterTodos(): Promise<{Entidade}[]> { ... }
    async obterPorId(id: number): Promise<{Entidade} | null> { ... }
    async atualizar(id: number, dto: Atualizar{Entidade}Dto): Promise<{Entidade} | null> { ... }
    async remover(id: number): Promise<{Entidade} | null> { ... }
}

export { {Entidade}Service };
```

Regras:
- Métodos retornam `| null`, service não lança HTTP exceptions
- Nomes em português: `criar`, `obterTodos`, `obterPorId`, `atualizar`, `remover`

---

## 8. Controller

Seguir o padrão de `usuario.controller.ts`:

```typescript
import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { Rotas } from '../../../shared/enums/rotas.enum';
import { PapelUsuario } from '@monorepo/contracts';
import { UsuarioPermissoes, Publico } from '../../../shared/decorators/permissoes.decorator';
import { UsuarioGuard } from '../../../shared/guards/usuario.guard';

@Controller(Rotas.{DOMINIO_MAIUSCULO})
@UseGuards(UsuarioGuard)
class {Entidade}Controller {
    constructor(private readonly {entidade}Service: {Entidade}Service) {}

    @Publico()
    @Get()
    async obterTodos() { ... }

    @Get(':id')
    @UsuarioPermissoes(PapelUsuario.ADMINISTRADOR, PapelUsuario.PADRAO)
    async obterPorId(@Param('id') id: number) { ... }

    @Post()
    @UsuarioPermissoes(PapelUsuario.ADMINISTRADOR)
    async criar(@Body() dto: Criar{Entidade}Dto) { ... }

    @Patch(':id')
    @UsuarioPermissoes(PapelUsuario.ADMINISTRADOR, PapelUsuario.PADRAO)
    async atualizar(@Param('id') id: number, @Body() dto: Atualizar{Entidade}Dto) { ... }

    @Delete(':id')
    @UsuarioPermissoes(PapelUsuario.ADMINISTRADOR)
    async remover(@Param('id') id: number) { ... }
}

export { {Entidade}Controller };
```

Regras:
- `@UseGuards(UsuarioGuard)` no nível da classe
- `@Publico()` em rotas sem autenticação
- `@UsuarioPermissoes(...)` para controle de acesso

---

## 9. Module

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([{Entidade}])],
    controllers: [{Entidade}Controller],
    providers: [{Entidade}Service],
    exports: [{Entidade}Service],
})
class {Entidade}Module {}

export { {Entidade}Module };
```

---

## 10. Registrar no módulo raiz

Em `apps/api/src/app.module.ts`, importar o novo módulo no array `imports`.

---

## 11. Verificar

- [ ] Rodar `npm run build` (root ou `turbo run build --filter=@monorepo/api`)
- [ ] Rodar `npm run lint` (root)
- [ ] Testar endpoint com `curl` ou REST client
