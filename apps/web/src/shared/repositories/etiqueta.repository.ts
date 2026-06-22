import { api } from '../services/api.service';
import type { EtiquetaRepositoryInterface } from '../interfaces/etiqueta-repository.interface';
import type { Etiqueta } from '../models';

class EtiquetaRepository implements EtiquetaRepositoryInterface {
    async obterTodos(): Promise<Etiqueta[]> {
        return api.get<Etiqueta[]>('etiquetas');
    }

    async obterPorId(id: number): Promise<Etiqueta> {
        return api.get<Etiqueta>(`etiquetas/${id}`);
    }
}

export { EtiquetaRepository };
