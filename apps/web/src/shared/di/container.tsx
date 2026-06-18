import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { PostagemRepository } from '../repositories/postagem.repository';
import { UsuarioRepository } from '../repositories/usuario.repository';
import type { PostagemRepositoryInterface } from '../interfaces/postagem-repository.interface';
import type { UsuarioRepositoryInterface } from '../interfaces/usuario-repository.interface';

interface Dependencias {
    postagemRepository: PostagemRepositoryInterface;
    usuarioRepository: UsuarioRepositoryInterface;
}

const DependenciaContext = createContext<Dependencias | null>(null);

function DependenciaProvider({ children }: { children: ReactNode }) {
    const dependencias = useMemo<Dependencias>(() => ({
        postagemRepository: new PostagemRepository(),
        usuarioRepository: new UsuarioRepository(),
    }), []);

    return (
        <DependenciaContext.Provider value={dependencias}>
            {children}
        </DependenciaContext.Provider>
    );
}

function usaDependencias(): Dependencias {
    const dependencias = useContext(DependenciaContext);

    if (!dependencias) {
        throw new Error('usaDependencias deve ser usado dentro de DependenciaProvider');
    }

    return dependencias;
}

export { DependenciaProvider, usaDependencias };
export type { Dependencias };
