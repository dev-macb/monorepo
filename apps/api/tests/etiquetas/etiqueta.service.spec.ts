import { Repository } from 'typeorm';
import { Etiqueta } from '../../src/modules/etiquetas/entities/etiqueta.entity';
import { EtiquetaService } from '../../src/modules/etiquetas/etiqueta.service';
import { CriarEtiquetaDto } from '../../src/modules/etiquetas/dtos/criar-etiqueta.dto';
import { AtualizarEtiquetaDto } from '../../src/modules/etiquetas/dtos/atualizar-etiqueta.dto';

describe('EtiquetaService', () => {
    let etiquetaService: EtiquetaService;
    let repositorioMock: jest.Mocked<Partial<Repository<Etiqueta>>>;

    const etiquetaPadrao: Etiqueta = {
        id: 1,
        nome: 'typescript',
        criadoEm: new Date('2024-01-01'),
        atualizadoEm: new Date('2024-01-01'),
    };

    beforeEach(() => {
        repositorioMock = {
            findOneBy: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn().mockImplementation((entidade, dto) => {
                Object.assign(entidade, dto);
                return entidade;
            }),
            remove: jest.fn(),
        };

        etiquetaService = new EtiquetaService(repositorioMock as unknown as Repository<Etiqueta>);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criar', () => {
        it('deve criar uma etiqueta quando o nome é único', async () => {
            const dto: CriarEtiquetaDto = { nome: 'typescript' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(repositorioMock, 'create').mockReturnValue(etiquetaPadrao);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaService.criar(dto);

            expect(resultado).toEqual(etiquetaPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ nome: 'typescript' });
            expect(repositorioMock.create).toHaveBeenCalledWith(dto);
            expect(repositorioMock.save).toHaveBeenCalledWith(etiquetaPadrao);
        });

        it('deve retornar null quando o nome já existe', async () => {
            const dto: CriarEtiquetaDto = { nome: 'typescript' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaService.criar(dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ nome: 'typescript' });
            expect(repositorioMock.create).not.toHaveBeenCalled();
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });
    });

    describe('obterTodos', () => {
        it('deve retornar lista ordenada por nome', async () => {
            const etiquetas = [
                { ...etiquetaPadrao, id: 2, nome: 'javascript' },
                { ...etiquetaPadrao, id: 1, nome: 'typescript' },
            ];

            jest.spyOn(repositorioMock, 'find').mockResolvedValue(etiquetas);

            const resultado = await etiquetaService.obterTodos();

            expect(resultado).toEqual(etiquetas);
            expect(repositorioMock.find).toHaveBeenCalledWith({ order: { nome: 'ASC' } });
        });
    });

    describe('obterPorId', () => {
        it('deve retornar a etiqueta quando encontrada', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaService.obterPorId(1);

            expect(resultado).toEqual(etiquetaPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('deve retornar null quando não encontrada', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await etiquetaService.obterPorId(999);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
        });
    });

    describe('atualizar', () => {
        it('deve atualizar a etiqueta quando dados são válidos', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'TypeScript' };
            const etiquetaExistente = { ...etiquetaPadrao };
            const etiquetaAtualizada = { ...etiquetaPadrao, nome: 'TypeScript' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(etiquetaExistente);
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(null);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(etiquetaAtualizada);

            const resultado = await etiquetaService.atualizar(1, dto);

            expect(resultado).toEqual(etiquetaAtualizada);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ nome: 'TypeScript' });
            expect(repositorioMock.merge).toHaveBeenCalledWith(etiquetaExistente, dto);
            expect(repositorioMock.save).toHaveBeenCalledWith(etiquetaAtualizada);
        });

        it('deve retornar null quando a etiqueta não existe', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'TypeScript' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await etiquetaService.atualizar(999, dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
            expect(repositorioMock.merge).not.toHaveBeenCalled();
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });

        it('deve retornar null quando o nome já está em uso por outra etiqueta', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'javascript' };
            const etiquetaExistente = { ...etiquetaPadrao, id: 2, nome: 'javascript' };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(etiquetaPadrao);
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValueOnce(etiquetaExistente);

            const resultado = await etiquetaService.atualizar(1, dto);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ nome: 'javascript' });
            expect(repositorioMock.merge).not.toHaveBeenCalled();
            expect(repositorioMock.save).not.toHaveBeenCalled();
        });

        it('deve atualizar quando o nome não foi alterado', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'typescript' };
            const etiquetaExistente = { ...etiquetaPadrao };

            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(etiquetaExistente);
            jest.spyOn(repositorioMock, 'save').mockResolvedValue(etiquetaExistente);

            const resultado = await etiquetaService.atualizar(1, dto);

            expect(resultado).toEqual(etiquetaExistente);
            expect(repositorioMock.findOneBy).toHaveBeenCalledTimes(1);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.merge).toHaveBeenCalled();
            expect(repositorioMock.save).toHaveBeenCalled();
        });
    });

    describe('remover', () => {
        it('deve remover a etiqueta quando existe', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(etiquetaPadrao);
            jest.spyOn(repositorioMock, 'remove').mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaService.remover(1);

            expect(resultado).toEqual(etiquetaPadrao);
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
            expect(repositorioMock.remove).toHaveBeenCalledWith(etiquetaPadrao);
        });

        it('deve retornar null quando a etiqueta não existe', async () => {
            jest.spyOn(repositorioMock, 'findOneBy').mockResolvedValue(null);

            const resultado = await etiquetaService.remover(999);

            expect(resultado).toBeNull();
            expect(repositorioMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
            expect(repositorioMock.remove).not.toHaveBeenCalled();
        });
    });
});
