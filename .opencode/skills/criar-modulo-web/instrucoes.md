# Skill: Criar Módulo no Frontend

Use esta skill ao criar uma nova página/módulo no frontend React.
Siga os passos abaixo, consultando os módulos `entrar/` e `inicio/` como referência.

---

## 1. Planejamento

Defina com o usuário:
- Nome do módulo (ex: `perfil`, `configuracoes`, `admin`)
- Rota (ex: `/perfil`, `/configuracoes`)
- Precisa de autenticação?
- Precisa de novo repositório/interface?
- Estado e interações (loading, empty, error, forms)

---

## 2. Estrutura de diretório

Criar: `apps/web/src/modules/{modulo}/`

```
{modulo}/
├── {modulo}.page.tsx       # Componente de página
├── {modulo}.viewmodel.ts   # Hook de lógica/estado
└── {modulo}.style.css      # Estilos CSS
```

---

## 3. ViewModel (`{modulo}.viewmodel.ts`)

Seguir o padrão de `entrar.viewmodel.ts`:

```typescript
import { useState, useCallback } from 'react';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usario-repository.interface';

function usa{Nome}ViewModel(
    usuarioRepository: UsuarioRepositoryInterface,
    // ... outros parâmetros
) {
    const [dado, setDado] = useState<Tipo | null>(null);
    const [carregando, setCarregando] = useState(true);

    const algumaAcao = useCallback(() => {
        // lógica
    }, []);

    return { dado, carregando, algumaAcao };
}

export { usa{Nome}ViewModel };
```

Regras:
- `function` declaration (não arrow function)
- Nome: `usa{Nome}ViewModel`
- Export nomeado
- **Nunca** chama `usaDependencias()` nem `usaAutenticacao()` dentro do viewmodel — recebe tudo por parâmetro
- `useEffect` para efeitos colaterais
- `useCallback` para handlers
- `JwtService.removerToken()` direto (não `authRepository.removeToken()`)

---

## 4. Page (`{modulo}.page.tsx`)

Seguir o padrão de `entrar.page.tsx`:

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
        dado,
        carregando,
        algumaAcao,
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
- Import do CSS primeiro
- `usaAutenticacao()` para auth
- `usaDependencias()` para DI — **sempre** `{ usuarioRepository }` ou `{ usuarioRepository, postagemRepository }`
- Loading: `if (carregando) return null`
- Export nomeado: `export { NomePage }`

---

## 5. Estilos (`{modulo}.style.css`)

CSS puro, mesmo padrão do projeto:
- Variáveis CSS em `:root` no `inicio.style.css`
- Classes em kebab-case
- Tema escuro
- Sem CSS Modules, sem Tailwind

---

## 6. Registrar rota

Em `apps/web/src/app/rotiador.tsx`:

```typescript
import { NomePage } from '../modules/{modulo}/{modulo}.page';

const rotiador = createBrowserRouter([
    // ... rotas existentes
    { path: '/{rota}', element: <NomePage /> },
]);
```

Se a rota exigir autenticação, redirecionar para `/entrar` quando não autenticado (no viewmodel ou page).

---

## 7. Repositório/Interface (se necessário)

Se o novo módulo precisar de um novo recurso de API:

### Interface em `shared/interfaces/`

```typescript
// shared/interfaces/{entidade}-repository.interface.ts
import type { AlgumTipo } from '../models';

interface {Entidade}RepositoryInterface {
    obterTodos(): Promise<AlgumTipo[]>;
    obterPorId(id: number): Promise<AlgumTipo>;
}

export { {Entidade}RepositoryInterface };
```

### Repositório em `shared/repositories/`

```typescript
// shared/repositories/{entidade}.repository.ts
import { api } from '../services/api.service';
import type { {Entidade}RepositoryInterface } from '../interfaces/{entidade}-repository.interface';

class {Entidade}Repository implements {Entidade}RepositoryInterface {
    async obterTodos(): Promise<AlgumTipo[]> {
        return api.get<AlgumTipo[]>('{rota-api}');
    }
}

export { {Entidade}Repository };
```

### Registrar no DI

Em `shared/di/container.tsx`, adicionar a interface e implementação:

```typescript
interface Dependencias {
    // ... existentes
    {entidade}Repository: {Entidade}RepositoryInterface;
}

// No DependenciaProvider:
const dependencias = useMemo<Dependencias>(() => ({
    // ... existentes
    {entidade}Repository: new {Entidade}Repository(),
}), []);
```

---

## 8. Verificar

- [ ] Rodar `npm run build` (root ou `turbo run build --filter=@monorepo/web`)
- [ ] Rodar `npm run lint`
- [ ] Testar navegação na rota criada
