import type { User } from '../models';
import type { CadastrarUsuarioRequest, AtualizarUsuarioRequest, FiltrosUsuarioRequest } from '../models';

interface UsuarioRepositoryInterface {
    obterTodos(filtros?: FiltrosUsuarioRequest): Promise<User[]>;
    obterPorId(id: number): Promise<User>;
    cadastrar(dados: CadastrarUsuarioRequest): Promise<User>;
    atualizar(id: number, dados: AtualizarUsuarioRequest): Promise<User>;
    remover(id: number): Promise<void>;
    entrar(email: string, senha: string): Promise<string>;
    registrarSe(dados: CadastrarUsuarioRequest): Promise<User>;
}

export { UsuarioRepositoryInterface }
