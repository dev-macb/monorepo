export interface Etiqueta {
    id: number;
    nome: string;
    criadoEm: string;
    atualizadoEm: string;
}

export interface CriarEtiquetaRequest {
    nome: string;
}

export interface AtualizarEtiquetaRequest {
    nome?: string;
}
