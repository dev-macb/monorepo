import { UsuarioRole } from '../enums/usuario-role.enum';

export interface Usuario {
    id: number;
    tipo: UsuarioRole;
    nomeCompleto: string;
    email: string;
    ativo: boolean;
    criadoEm: Date;
    atualizadoEm: Date;
}

export interface UsuarioSemSenha extends Omit<Usuario, 'senha'> {}

export interface CadastrarUsuarioRequest {
    tipo?: UsuarioRole;
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
    tipo?: UsuarioRole;
    ativo?: boolean;
}