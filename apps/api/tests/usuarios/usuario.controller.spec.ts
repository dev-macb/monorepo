import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioController } from '../../src/modules/usuarios/usuario.controller';
import { UsuarioService } from '../../src/modules/usuarios/usuario.service';
import { CadastrarUsuarioDto } from '../../src/modules/usuarios/dtos/cadastrar-usuario.dto';
import { AtualizarUsuarioDto } from '../../src/modules/usuarios/dtos/atualizar-usuario.dto';
import { EntrarUsuarioDto } from '../../src/modules/usuarios/dtos/entrar-usuario.dto';

describe('UsuarioController', () => {
    let usuarioController: UsuarioController;
    let usuarioService: jest.Mocked<UsuarioService>;
    let jwtService: jest.Mocked<JwtService>;

    const usuarioPadrao = {
        id: 1,
        tipo: 1,
        nomeCompleto: 'Usuário Teste',
        email: 'teste@email.com',
        senha: 'hash-da-senha',
        ativo: true,
        criadoEm: new Date('2024-01-01'),
        atualizadoEm: new Date('2024-01-01'),
    };

    beforeEach(async () => {
        const servicoMock = {
            obterTodos: jest.fn(),
            obterPorId: jest.fn(),
            obterPorEmail: jest.fn(),
            cadastrar: jest.fn(),
            atualizar: jest.fn(),
            remover: jest.fn(),
            entrar: jest.fn(),
            desativarConta: jest.fn(),
        };

        const jwtMock = {
            sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuarioController],
            providers: [
                {
                    provide: UsuarioService,
                    useValue: servicoMock,
                },
                {
                    provide: JwtService,
                    useValue: jwtMock,
                },
            ],
        }).compile();

        usuarioController = module.get<UsuarioController>(UsuarioController);
        usuarioService = module.get(UsuarioService);
        jwtService = module.get(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('entrar', () => {
        const dto: EntrarUsuarioDto = { email: 'teste@email.com', senha: 'senha123' };

        it('deve retornar token quando credenciais válidas', async () => {
            const token = 'jwt-token';

            usuarioService.entrar.mockResolvedValue(usuarioPadrao);
            jwtService.sign.mockReturnValue(token);

            const resultado = await usuarioController.entrar(dto);

            expect(resultado).toEqual({ token_usuario: token });
            expect(usuarioService.entrar).toHaveBeenCalledWith(dto);
            expect(jwtService.sign).toHaveBeenCalledWith({
                idUsuario: usuarioPadrao.id,
                tipoUsuario: usuarioPadrao.tipo,
            });
        });

        it('deve lançar UnauthorizedException quando credenciais inválidas', async () => {
            usuarioService.entrar.mockResolvedValue(null);

            await expect(usuarioController.entrar(dto)).rejects.toThrow(UnauthorizedException);
            expect(usuarioService.entrar).toHaveBeenCalledWith(dto);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });

        it('deve lançar UnauthorizedException quando usuário inativo', async () => {
            usuarioService.entrar.mockResolvedValue({ ...usuarioPadrao, ativo: false });

            await expect(usuarioController.entrar(dto)).rejects.toThrow(UnauthorizedException);
            expect(usuarioService.entrar).toHaveBeenCalledWith(dto);
            expect(jwtService.sign).not.toHaveBeenCalled();
        });
    });

    describe('registrarSe', () => {
        const dto: CadastrarUsuarioDto = {
            nomeCompleto: 'Usuário Teste',
            email: 'teste@email.com',
            senha: 'senha123',
        };

        it('deve cadastrar e retornar usuário sem senha', async () => {
            usuarioService.cadastrar.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioController.registrarSe(dto);

            expect(resultado).not.toHaveProperty('senha');
            expect(resultado).toHaveProperty('nomeCompleto', usuarioPadrao.nomeCompleto);
            expect(usuarioService.cadastrar).toHaveBeenCalledWith(dto);
        });

        it('deve lançar ConflictException quando email já existe', async () => {
            usuarioService.cadastrar.mockResolvedValue(null);

            await expect(usuarioController.registrarSe(dto)).rejects.toThrow(ConflictException);
            expect(usuarioService.cadastrar).toHaveBeenCalledWith(dto);
        });
    });

    describe('desativarConta', () => {
        it('deve desativar e retornar mensagem', async () => {
            usuarioService.desativarConta.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioController.desativarConta(1);

            expect(resultado).toEqual({ message: 'Conta desativada com sucesso' });
            expect(usuarioService.desativarConta).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException quando não encontrado', async () => {
            usuarioService.desativarConta.mockResolvedValue(null);

            await expect(usuarioController.desativarConta(999)).rejects.toThrow(NotFoundException);
            expect(usuarioService.desativarConta).toHaveBeenCalledWith(999);
        });
    });

    describe('obterTodos', () => {
        it('deve retornar lista sem senha', async () => {
            const usuarios = [usuarioPadrao];

            usuarioService.obterTodos.mockResolvedValue(usuarios);

            const resultado = await usuarioController.obterTodos();

            expect(resultado).toHaveLength(1);
            expect(resultado[0]).not.toHaveProperty('senha');
            expect(usuarioService.obterTodos).toHaveBeenCalled();
        });
    });

    describe('obterPorId', () => {
        it('deve retornar usuário sem senha', async () => {
            usuarioService.obterPorId.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioController.obterPorId(1);

            expect(resultado).not.toHaveProperty('senha');
            expect(resultado).toHaveProperty('nomeCompleto', usuarioPadrao.nomeCompleto);
            expect(usuarioService.obterPorId).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException quando não encontrado', async () => {
            usuarioService.obterPorId.mockResolvedValue(null);

            await expect(usuarioController.obterPorId(999)).rejects.toThrow(NotFoundException);
            expect(usuarioService.obterPorId).toHaveBeenCalledWith(999);
        });
    });

    describe('cadastrar', () => {
        const dto: CadastrarUsuarioDto = {
            nomeCompleto: 'Usuário Teste',
            email: 'teste@email.com',
            senha: 'senha123',
        };

        it('deve cadastrar e retornar sem senha', async () => {
            usuarioService.cadastrar.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioController.cadastrar(dto);

            expect(resultado).not.toHaveProperty('senha');
            expect(usuarioService.cadastrar).toHaveBeenCalledWith(dto);
        });

        it('deve lançar ConflictException quando email existe', async () => {
            usuarioService.cadastrar.mockResolvedValue(null);

            await expect(usuarioController.cadastrar(dto)).rejects.toThrow(ConflictException);
            expect(usuarioService.cadastrar).toHaveBeenCalledWith(dto);
        });
    });

    describe('atualizar', () => {
        const dto: AtualizarUsuarioDto = { nomeCompleto: 'Nome Atualizado' };

        it('deve atualizar e retornar sem senha', async () => {
            const usuarioAtualizado = { ...usuarioPadrao, nomeCompleto: 'Nome Atualizado' };

            usuarioService.atualizar.mockResolvedValue(usuarioAtualizado);

            const resultado = await usuarioController.atualizar(1, dto);

            expect(resultado).not.toHaveProperty('senha');
            expect(resultado).toHaveProperty('nomeCompleto', 'Nome Atualizado');
            expect(usuarioService.atualizar).toHaveBeenCalledWith(1, dto);
        });

        it('deve lançar NotFoundException quando não existe', async () => {
            usuarioService.atualizar.mockResolvedValue(null);

            await expect(usuarioController.atualizar(999, dto)).rejects.toThrow(NotFoundException);
            expect(usuarioService.atualizar).toHaveBeenCalledWith(999, dto);
        });
    });

    describe('remover', () => {
        it('deve remover com HttpCode 204', async () => {
            usuarioService.remover.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioController.remover(1);

            expect(resultado).toBeUndefined();
            expect(usuarioService.remover).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException quando não existe', async () => {
            usuarioService.remover.mockResolvedValue(null);

            await expect(usuarioController.remover(999)).rejects.toThrow(NotFoundException);
            expect(usuarioService.remover).toHaveBeenCalledWith(999);
        });
    });
});
