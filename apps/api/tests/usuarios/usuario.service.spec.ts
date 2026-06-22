import { Repository, SelectQueryBuilder } from 'typeorm';
import { Usuario } from '../../src/modules/usuarios/entities/usuario.entity';
import { UsuarioService } from '../../src/modules/usuarios/usuario.service';
import { CadastrarUsuarioDto } from '../../src/modules/usuarios/dtos/cadastrar-usuario.dto';
import { AtualizarUsuarioDto } from '../../src/modules/usuarios/dtos/atualizar-usuario.dto';
import { EntrarUsuarioDto } from '../../src/modules/usuarios/dtos/entrar-usuario.dto';
import { FiltrosUsuarioDto } from '../../src/modules/usuarios/dtos/filtros-usuario.dto';
import { SenhaUtil } from '../../src/shared/utils/senha.util';

describe('UsuarioService', () => {
    let usuarioService: UsuarioService;
    let repositorioMock: jest.Mocked<Partial<Repository<Usuario>>>;
    let queryBuilderMock: jest.Mocked<Partial<SelectQueryBuilder<Usuario>>>;

    const usuarioPadrao: Usuario = {
        id: 1,
        tipo: 1,
        nomeCompleto: 'Usuário Teste',
        email: 'teste@email.com',
        senha: 'hash-da-senha',
        ativo: true,
        criadoEm: new Date('2024-01-01'),
        atualizadoEm: new Date('2024-01-01'),
    };

    beforeEach(() => {
        queryBuilderMock = {
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn(),
        };

        repositorioMock = {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn().mockImplementation((entidade, dto) => {
                Object.assign(entidade, dto);
                return entidade;
            }),
            remove: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
        };

        usuarioService = new UsuarioService(repositorioMock as unknown as Repository<Usuario>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('obterTodos', () => {
        it('deve retornar lista sem filtros', async () => {
            const usuarios = [usuarioPadrao];

            queryBuilderMock.getMany.mockResolvedValue(usuarios);

            const resultado = await usuarioService.obterTodos();

            expect(resultado).toEqual(usuarios);
            expect(repositorioMock.createQueryBuilder).toHaveBeenCalled();
            expect(queryBuilderMock.orderBy).toHaveBeenCalled();
        });

        it('deve filtrar por nomeCompleto', async () => {
            const filtros: FiltrosUsuarioDto = { nomeCompleto: 'Teste' };

            queryBuilderMock.getMany.mockResolvedValue([usuarioPadrao]);

            await usuarioService.obterTodos(filtros);

            expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
                expect.stringContaining('nomeCompleto'),
                expect.objectContaining({ nome: expect.stringContaining('Teste') }),
            );
        });

        it('deve filtrar por email', async () => {
            const filtros: FiltrosUsuarioDto = { email: 'teste@email.com' };

            queryBuilderMock.getMany.mockResolvedValue([usuarioPadrao]);

            await usuarioService.obterTodos(filtros);

            expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
                expect.stringContaining('email'),
                expect.objectContaining({ email: expect.stringContaining('teste@email.com') }),
            );
        });

        it('deve filtrar por tipo', async () => {
            const filtros: FiltrosUsuarioDto = { tipo: 0 };

            queryBuilderMock.getMany.mockResolvedValue([usuarioPadrao]);

            await usuarioService.obterTodos(filtros);

            expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
                expect.stringContaining('tipo'),
                expect.objectContaining({ tipo: 0 }),
            );
        });

        it('deve filtrar por ativo', async () => {
            const filtros: FiltrosUsuarioDto = { ativo: true };

            queryBuilderMock.getMany.mockResolvedValue([usuarioPadrao]);

            await usuarioService.obterTodos(filtros);

            expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
                expect.stringContaining('ativo'),
                expect.objectContaining({ ativo: true }),
            );
        });
    });

    describe('obterPorId', () => {
        it('deve retornar usuário quando encontrado', async () => {
            repositorioMock.findOneBy.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioService.obterPorId(1);

            expect(resultado).toEqual(usuarioPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('deve retornar null quando não encontrado', async () => {
            repositorioMock.findOneBy.mockResolvedValue(null);

            const resultado = await usuarioService.obterPorId(999);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    });

    describe('obterPorEmail', () => {
        it('deve retornar usuário quando encontrado', async () => {
            repositorioMock.findOneBy.mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioService.obterPorEmail('teste@email.com');

            expect(resultado).toEqual(usuarioPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: 'teste@email.com' });
        });

        it('deve retornar null quando não encontrado', async () => {
            repositorioMock.findOneBy.mockResolvedValue(null);

            const resultado = await usuarioService.obterPorEmail('nao-existe@email.com');

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: 'nao-existe@email.com' });
        });
    });

    describe('cadastrar', () => {
        const dto: CadastrarUsuarioDto = {
            nomeCompleto: 'Usuário Teste',
            email: 'teste@email.com',
            senha: 'senha123',
        };

        it('deve cadastrar quando email é único', async () => {
            const hashEsperado = 'hash-da-senha';
            const usuarioCriado = { ...usuarioPadrao, senha: hashEsperado };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(repositorioMock, 'create').mockReturnValue(usuarioCriado);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(usuarioCriado);
            jest.spyOn(SenhaUtil, 'gerarHash').mockResolvedValue(hashEsperado);

            const resultado = await usuarioService.cadastrar(dto);

            expect(resultado).toEqual(usuarioCriado);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: dto.email });
            expect(SenhaUtil.gerarHash).toHaveBeenCalledWith(dto.senha);
            expect(repositorioMock.save).toHaveBeenCalled();
        });

        it('deve retornar null quando email já existe', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioService.cadastrar(dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: dto.email });
            expect(repositorioMock.create).not.toHaveBeenCalled();
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });
    });

    describe('atualizar', () => {
        it('deve atualizar quando dados válidos', async () => {
            const dto: AtualizarUsuarioDto = { nomeCompleto: 'Nome Atualizado' };
            const usuarioExistente = { ...usuarioPadrao };
            const usuarioAtualizado = { ...usuarioPadrao, nomeCompleto: 'Nome Atualizado' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioExistente);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(usuarioAtualizado);

            const resultado = await usuarioService.atualizar(1, dto);

            expect(resultado).toEqual(usuarioAtualizado);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.merge).toHaveBeenCalledWith(usuarioExistente, dto);
            expect(repositorioMock.save).toHaveBeenCalled();
        });

        it('deve retornar null quando usuário não existe', async () => {
            const dto: AtualizarUsuarioDto = { nomeCompleto: 'Nome' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await usuarioService.atualizar(999, dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
            expect(repositorioMock.merge).not.toHaveBeenCalled();
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });

        it('deve atualizar senha quando fornecida', async () => {
            const dto: AtualizarUsuarioDto = { senha: 'nova-senha-123' };
            const usuarioExistente = { ...usuarioPadrao };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioExistente);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(usuarioExistente);
            jest.spyOn(SenhaUtil, 'gerarHash').mockResolvedValue('novo-hash');

            await usuarioService.atualizar(1, dto);

            expect(SenhaUtil.gerarHash).toHaveBeenCalledWith(dto.senha);
            expect(repositorioMock.merge).toHaveBeenCalled();
            expect(repositorioMock.save).toHaveBeenCalled();
        });

        it('deve lançar ConflictException quando email já em uso', async () => {
            const dto: AtualizarUsuarioDto = { email: 'outro@email.com' };
            const usuarioExistente = { ...usuarioPadrao, email: 'original@email.com' };
            const usuarioComEmail = { ...usuarioPadrao, id: 2, email: 'outro@email.com' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(usuarioExistente);
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(usuarioComEmail);

            await expect(usuarioService.atualizar(1, dto)).rejects.toThrow('Este e-mail já está em uso por outro usuário');
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });

        it('deve atualizar quando email não foi alterado', async () => {
            const dto: AtualizarUsuarioDto = { email: 'teste@email.com' };
            const usuarioExistente = { ...usuarioPadrao };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioExistente);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(usuarioExistente);

            const resultado = await usuarioService.atualizar(1, dto);

            expect(resultado).toEqual(usuarioExistente);
            expect(repositorioMock.findOneBy).toHaveBeenCalledTimes(1);
            expect(repositorioMock.save).toHaveBeenCalled();
        });
    });

    describe('remover', () => {
        it('deve remover quando existe', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioPadrao);
            jest.spyOn(repositorioMock, 'remove').mockResolvedValue(usuarioPadrao);

            const resultado = await usuarioService.remover(1);

            expect(resultado).toEqual(usuarioPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.remove).toHaveBeenCalledWith(usuarioPadrao);
        });

        it('deve retornar null quando não encontrado', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await usuarioService.remover(999);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
            expect(repositorioMock.remove).not.toHaveBeenCalled();
        });
    });

    describe('entrar', () => {
        const dto: EntrarUsuarioDto = {
            email: 'teste@email.com',
            senha: 'senha123',
        };

        it('deve retornar usuário quando credenciais válidas', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioPadrao);
            jest.spyOn(SenhaUtil, 'validarHash').mockResolvedValue(true);

            const resultado = await usuarioService.entrar(dto);

            expect(resultado).toEqual(usuarioPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: dto.email });
            expect(SenhaUtil.validarHash).toHaveBeenCalledWith(dto.senha, usuarioPadrao.senha);
        });

        it('deve retornar null quando email não encontrado', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await usuarioService.entrar(dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: dto.email });
            expect(SenhaUtil.validarHash).not.toHaveBeenCalled();
        });

        it('deve retornar null quando senha inválida', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioPadrao);
            jest.spyOn(SenhaUtil, 'validarHash').mockResolvedValue(false);

            const resultado = await usuarioService.entrar(dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ email: dto.email });
            expect(SenhaUtil.validarHash).toHaveBeenCalled();
        });
    });

    describe('desativarConta', () => {
        it('deve desativar quando existe', async () => {
            const usuarioExistente = { ...usuarioPadrao, ativo: true };
            const usuarioDesativado = { ...usuarioPadrao, ativo: false };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(usuarioExistente);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(usuarioDesativado);

            const resultado = await usuarioService.desativarConta(1);

            expect(resultado).toEqual(usuarioDesativado);
            expect(usuarioExistente.ativo).toBe(false);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.save).toHaveBeenCalledWith(usuarioExistente);
        });

        it('deve retornar null quando não encontrado', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await usuarioService.desativarConta(999);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });
    });
});
