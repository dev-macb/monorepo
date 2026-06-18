# Template de Especificação (Spec-Driven Development)

Use este template para documentar toda nova funcionalidade antes da implementação.
A spec deve ser mostrada ao usuário para aprovação antes de escrever código.

---

## Spec: {Nome da Funcionalidade}

### Contexto

{Por que essa funcionalidade é necessária? Qual problema resolve?}

### Comportamento esperado

{Descrição clara do que o sistema deve fazer. Use "O sistema deve..."}

### Arquivos afetados

- `apps/api/src/modules/{dominio}/...`
- `apps/web/src/modules/{modulo}/...`
- `packages/contracts/src/...`

### Padrão a seguir

{Qual padrão existente deve ser replicado? Ex.: "Seguir o mesmo padrão do módulo usuarios/", "Criar página seguindo o padrão de entrar/", etc.}

### Especificação técnica

#### Backend

- **Endpoint**: `{MÉTODO} /{rota}`
- **Autenticação**: `@Publico()` | `@UsuarioPermissoes(...)`
- **Validação**: {DTOs e regras de validação}
- **Comportamento**: {lógica do service}

#### Frontend

- **Rota**: `/{caminho}`
- **Componentes**: {página, viewmodel, componentes compartilhados}
- **Estado**: {o que o viewmodel gerencia}
- **Comportamento**: {interações do usuário, loading, erro, empty}

#### Contracts

- **Tipos novos**: {interfaces, types adicionados}
- **Enums novos**: {se aplicável}

### Mock / Exemplo de uso

```typescript
// Exemplo de chamada e resposta esperada
```

### Critérios de aceite

- [ ] Critério 1
- [ ] Critério 2
- [ ] Testes passando
- [ ] Build sem erros

### Observações

{Qualquer informação adicional relevante.}
