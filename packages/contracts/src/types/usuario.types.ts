import { TipoUsuario } from '../enums/tipo-usuario.enum.js';

export interface Usuario {
    id: number;
    tipo: TipoUsuario;
    nomeCompleto: string;
    email: string;
    senha: string;
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
}

export interface UsuarioSemSenha extends Omit<Usuario, 'senha'> { }

export interface CadastrarUsuarioRequest {
    tipo?: TipoUsuario;
    nomeCompleto: string;
    email: string;
    senha: string;
    ativo?: boolean;
}

export interface AtualizarUsuarioRequest extends Partial<Omit<CadastrarUsuarioRequest, 'email'>> {
    email?: string;
}

export interface EntrarUsuarioRequest {
    email: string;
    senha: string;
}

export interface EntrarUsuarioResponse {
    token_usuario: string;
}

export interface FiltrosUsuarioRequest {
    nomeCompleto?: string;
    email?: string;
    tipo?: TipoUsuario;
    ativo?: boolean;
}

export interface TokenPayload {
    idUsuario: number;
    tipoUsuario: number;
}
