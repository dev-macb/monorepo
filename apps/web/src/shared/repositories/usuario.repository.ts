import { api } from '../services/api.service';
import type { UsuarioRepositoryInterface } from '../interfaces/usuario-repository.interface';
import type { Usuario } from '../models';
import type { CadastrarUsuarioRequest, AtualizarUsuarioRequest, FiltrosUsuarioRequest } from '../models';

class UsuarioRepository implements UsuarioRepositoryInterface {
    async obterTodos(filtros?: FiltrosUsuarioRequest): Promise<Usuario[]> {
        return api.get<Usuario[]>('usuarios', filtros);
    }

    async obterPorId(id: number): Promise<Usuario> {
        return api.get<Usuario>(`usuarios/${id}`);
    }

    async cadastrar(dados: CadastrarUsuarioRequest): Promise<Usuario> {
        return api.post<Usuario>('usuarios', dados);
    }

    async atualizar(id: number, dados: AtualizarUsuarioRequest): Promise<Usuario> {
        return api.patch<Usuario>(`usuarios/${id}`, dados);
    }

    async remover(id: number): Promise<void> {
        await api.delete(`usuarios/${id}`);
    }

    async entrar(email: string, senha: string): Promise<string> {
        const resposta = await api.post<{ token_usuario: string }>('/usuarios/entrar', { email, senha });
        return resposta.token_usuario;
    }

    async registrarSe(dados: CadastrarUsuarioRequest): Promise<Usuario> {
        return api.post<Usuario>('usuarios/registrar-se', dados);
    }
}

export { UsuarioRepository };
