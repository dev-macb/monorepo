import type { Etiqueta } from '../models';

interface EtiquetaRepositoryInterface {
    obterTodos(): Promise<Etiqueta[]>;
    obterPorId(id: number): Promise<Etiqueta>;
}

export { EtiquetaRepositoryInterface }
