import { renderHook, act } from '@testing-library/react';
import { usaEntrarViewModel } from '../../src/modules/entrar/entrar.viewmodel';
import type { UsuarioRepositoryInterface } from '../../src/shared/interfaces/usuario-repository.interface';

describe('usaEntrarViewModel', () => {
    let usuarioRepositoryMock: jest.Mocked<UsuarioRepositoryInterface>;
    let definirAutenticacaoMock: jest.Mock;
    let onSuccessMock: jest.Mock;

    beforeEach(() => {
        usuarioRepositoryMock = {
            entrar: jest.fn(),
            obterTodos: jest.fn(),
            obterPorId: jest.fn(),
            cadastrar: jest.fn(),
            atualizar: jest.fn(),
            remover: jest.fn(),
            desativar: jest.fn(),
            registrarSe: jest.fn(),
        };
        definirAutenticacaoMock = jest.fn();
        onSuccessMock = jest.fn();
    });

    it('deve logar com sucesso', async () => {
        const token = 'token-jwt-valido';
        usuarioRepositoryMock.entrar.mockResolvedValue(token);

        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirEmail('usuario@email.com');
            result.current.definirSenha('senha123');
        });

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(usuarioRepositoryMock.entrar).toHaveBeenCalledWith('usuario@email.com', 'senha123');
        expect(definirAutenticacaoMock).toHaveBeenCalledWith(token);
        expect(onSuccessMock).toHaveBeenCalled();
        expect(result.current.carregando).toBe(false);
        expect(result.current.mensagemErro).toBe('');
    });

    it('deve definir mensagem de erro quando campos vazios', async () => {
        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(result.current.mensagemErro).toBe('Preencha todos os campos');
        expect(usuarioRepositoryMock.entrar).not.toHaveBeenCalled();
        expect(definirAutenticacaoMock).not.toHaveBeenCalled();
        expect(onSuccessMock).not.toHaveBeenCalled();
    });

    it('deve manter carregando como false quando email vazio', async () => {
        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirSenha('senha123');
        });

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(result.current.carregando).toBe(false);
        expect(result.current.mensagemErro).toBe('Preencha todos os campos');
    });

    it('deve definir mensagem de erro quando credenciais invalidas', async () => {
        const erro = { response: { data: { message: 'Credenciais inválidas' } } };
        usuarioRepositoryMock.entrar.mockRejectedValue(erro);

        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirEmail('usuario@email.com');
            result.current.definirSenha('senha-errada');
        });

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(result.current.mensagemErro).toBe('Credenciais inválidas');
        expect(definirAutenticacaoMock).not.toHaveBeenCalled();
        expect(onSuccessMock).not.toHaveBeenCalled();
        expect(result.current.carregando).toBe(false);
    });

    it('deve extrair mensagem de error.response.data.error quando message ausente', async () => {
        const erro = { response: { data: { error: 'Unauthorized' } } };
        usuarioRepositoryMock.entrar.mockRejectedValue(erro);

        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirEmail('usuario@email.com');
            result.current.definirSenha('senha123');
        });

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(result.current.mensagemErro).toBe('Unauthorized');
    });

    it('deve usar mensagem padrao quando erro nao tem response', async () => {
        usuarioRepositoryMock.entrar.mockRejectedValue(new Error('Erro de rede'));

        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirEmail('usuario@email.com');
            result.current.definirSenha('senha123');
        });

        await act(async () => {
            await result.current.login(onSuccessMock);
        });

        expect(result.current.mensagemErro).toBe('Erro desconhecido');
        expect(definirAutenticacaoMock).not.toHaveBeenCalled();
        expect(onSuccessMock).not.toHaveBeenCalled();
    });

    it('deve alterar carregando durante a requisicao', async () => {
        let resolver!: (token: string) => void;
        usuarioRepositoryMock.entrar.mockReturnValue(new Promise((resolve) => { resolver = resolve; }));

        const { result } = renderHook(() => usaEntrarViewModel(usuarioRepositoryMock, definirAutenticacaoMock));

        act(() => {
            result.current.definirEmail('usuario@email.com');
            result.current.definirSenha('senha123');
        });

        let promise: Promise<void>;
        act(() => { promise = result.current.login(onSuccessMock); });

        expect(result.current.carregando).toBe(true);

        await act(async () => {
            resolver('token');
            await promise!;
        });

        expect(result.current.carregando).toBe(false);
    });
});
