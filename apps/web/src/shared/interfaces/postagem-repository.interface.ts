import type { PostagemFeed } from '../models';

interface PostagemRepositoryInterface {
    obterTodos(): Promise<PostagemFeed[]>;
    cadastrar(conteudo: string, tags: string[]): Promise<void>;
}

export { PostagemRepositoryInterface };