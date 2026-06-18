import { api } from '../services/api.service';
import type { PostagemRepositoryInterface } from '../interfaces/postagem-repository.interface';
import type { PostagemFeed } from '../models';

export class PostagemRepository implements PostagemRepositoryInterface {
    async obterTodos(): Promise<PostagemFeed[]> {
        return api.get<PostagemFeed[]>('postagens');
    }

    async cadastrar(conteudo: string, tags: string[]): Promise<void> {
        await api.post('postagens', { conteudo, tags });
    }
}
