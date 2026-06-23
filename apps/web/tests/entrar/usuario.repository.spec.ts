import { UsuarioRepository } from '../../src/shared/repositories/usuario.repository';
import { api } from '../../src/shared/services/api.service';

jest.mock('../../src/shared/services/api.service', () => ({
    api: {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('UsuarioRepository', () => {
    let repository: UsuarioRepository;

    beforeEach(() => {
        repository = new UsuarioRepository();
        jest.clearAllMocks();
    });

    describe('entrar', () => {
        it('deve chamar api.post com url e dados corretos', async () => {
            const token = 'token-jwt-exemplo';
            (api.post as jest.Mock).mockResolvedValue({ token_usuario: token });

            const resultado = await repository.entrar('teste@email.com', 'senha123');

            expect(api.post).toHaveBeenCalledWith('/usuarios/entrar', {
                email: 'teste@email.com',
                senha: 'senha123',
            });
            expect(resultado).toBe(token);
        });

        it('deve retornar token_usuario da resposta', async () => {
            (api.post as jest.Mock).mockResolvedValue({ token_usuario: 'outro-token' });

            const resultado = await repository.entrar('a@b.com', '123');

            expect(resultado).toBe('outro-token');
        });

        it('deve propagar erro quando api.post rejeita', async () => {
            const erro = new Error('Erro de rede');
            (api.post as jest.Mock).mockRejectedValue(erro);

            await expect(repository.entrar('teste@email.com', 'senha123')).rejects.toThrow(erro);
        });
    });
});
