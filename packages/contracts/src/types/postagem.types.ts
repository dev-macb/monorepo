import { Usuario } from './usuario.types';

export interface Postagem {
    id: number;
    usuarioId: number;
    conteudo: string;
    tags: string[];
    curtidas: number;
    curtido: boolean;
    criadoEm: string;
}

export interface PostagemFeed {
    id: number;
    conteudo: string;
    tags: string[];
    criadoEm: string;
    autor: Usuario;
    curtidas: number;
    curtidoPorMim: boolean;
}

export interface CriarPostagemRequest {
    conteudo: string;
    tags?: string[];
}

export interface AtualizarPostagemRequest {
    conteudo?: string;
    tags?: string[];
}
