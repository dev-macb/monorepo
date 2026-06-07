export interface Post {
    id: number;
    usuarioId: number;
    conteudo: string;
    tags: string[];
    curtidas: number;
    curtido: boolean;
    criadoEm: Date;
}

export interface CriarPostRequest {
    conteudo: string;
    tags?: string[];
}

export interface AtualizarPostRequest {
    conteudo?: string;
    tags?: string[];
}