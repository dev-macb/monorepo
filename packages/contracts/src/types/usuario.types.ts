import { PapelUsuario } from '../enums/papeis-usuario.enum';

export interface Usuario {
    id: number;
    tipo: PapelUsuario;
    nomeCompleto: string;
    email: string;
    senha: string;
    ativo: boolean;
    criadoEm: string;
    atualizadoEm: string;
}

export interface UsuarioSemSenha extends Omit<Usuario, 'senha'> {}

export interface CadastrarUsuarioRequest {
    tipo?: PapelUsuario;
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
    tipo?: PapelUsuario;
    ativo?: boolean;
}

export interface TokenPayload {
    idUsuario: number;
    tipoUsuario: number;
}
