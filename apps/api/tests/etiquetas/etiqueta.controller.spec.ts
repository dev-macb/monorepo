import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EtiquetaController } from '../../src/modules/etiquetas/etiqueta.controller';
import { EtiquetaService } from '../../src/modules/etiquetas/etiqueta.service';
import { CriarEtiquetaDto } from '../../src/modules/etiquetas/dtos/criar-etiqueta.dto';
import { AtualizarEtiquetaDto } from '../../src/modules/etiquetas/dtos/atualizar-etiqueta.dto';

describe('EtiquetaController', () => {
    let etiquetaController: EtiquetaController;
    let etiquetaService: jest.Mocked<EtiquetaService>;

    const etiquetaPadrao = {
        id: 1,
        nome: 'typescript',
        criadoEm: new Date('2024-01-01'),
        atualizadoEm: new Date('2024-01-01'),
    };

    beforeEach(async () => {
        const servicoMock = {
            criar: jest.fn(),
            obterTodos: jest.fn(),
            obterPorId: jest.fn(),
            atualizar: jest.fn(),
            remover: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [EtiquetaController],
            providers: [
                {
                    provide: EtiquetaService,
                    useValue: servicoMock,
                },
            ],
        }).compile();

        etiquetaController = module.get<EtiquetaController>(EtiquetaController);
        etiquetaService = module.get(EtiquetaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('obterTodos', () => {
        it('deve retornar a lista de etiquetas do serviço', async () => {
            const etiquetas = [etiquetaPadrao];

            etiquetaService.obterTodos.mockResolvedValue(etiquetas);

            const resultado = await etiquetaController.obterTodos();

            expect(resultado).toEqual(etiquetas);
            expect(etiquetaService.obterTodos).toHaveBeenCalledTimes(1);
        });
    });

    describe('obterPorId', () => {
        it('deve retornar a etiqueta quando encontrada', async () => {
            etiquetaService.obterPorId.mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaController.obterPorId(1);

            expect(resultado).toEqual(etiquetaPadrao);
            expect(etiquetaService.obterPorId).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException quando não encontrada', async () => {
            etiquetaService.obterPorId.mockResolvedValue(null);

            await expect(etiquetaController.obterPorId(999)).rejects.toThrow(NotFoundException);
            expect(etiquetaService.obterPorId).toHaveBeenCalledWith(999);
        });
    });

    describe('criar', () => {
        it('deve criar e retornar a etiqueta', async () => {
            const dto: CriarEtiquetaDto = { nome: 'typescript' };

            etiquetaService.criar.mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaController.criar(dto);

            expect(resultado).toEqual(etiquetaPadrao);
            expect(etiquetaService.criar).toHaveBeenCalledWith(dto);
        });

        it('deve lançar ConflictException quando o nome já existe', async () => {
            const dto: CriarEtiquetaDto = { nome: 'typescript' };

            etiquetaService.criar.mockResolvedValue(null);

            await expect(etiquetaController.criar(dto)).rejects.toThrow(ConflictException);
            expect(etiquetaService.criar).toHaveBeenCalledWith(dto);
        });
    });

    describe('atualizar', () => {
        it('deve atualizar e retornar a etiqueta', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'TypeScript' };
            const etiquetaAtualizada = { ...etiquetaPadrao, nome: 'TypeScript' };

            etiquetaService.atualizar.mockResolvedValue(etiquetaAtualizada);

            const resultado = await etiquetaController.atualizar(1, dto);

            expect(resultado).toEqual(etiquetaAtualizada);
            expect(etiquetaService.atualizar).toHaveBeenCalledWith(1, dto);
        });

        it('deve lançar NotFoundException quando a etiqueta não existe', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'TypeScript' };

            etiquetaService.atualizar.mockResolvedValue(null);
            etiquetaService.obterPorId.mockResolvedValue(null);

            await expect(etiquetaController.atualizar(999, dto)).rejects.toThrow(NotFoundException);
            expect(etiquetaService.atualizar).toHaveBeenCalledWith(999, dto);
        });

        it('deve lançar ConflictException quando o nome já está em uso', async () => {
            const dto: AtualizarEtiquetaDto = { nome: 'javascript' };

            etiquetaService.atualizar.mockResolvedValue(null);
            etiquetaService.obterPorId.mockResolvedValue(etiquetaPadrao);

            await expect(etiquetaController.atualizar(1, dto)).rejects.toThrow(ConflictException);
            expect(etiquetaService.atualizar).toHaveBeenCalledWith(1, dto);
        });
    });

    describe('remover', () => {
        it('deve remover a etiqueta com HttpCode 204', async () => {
            etiquetaService.remover.mockResolvedValue(etiquetaPadrao);

            const resultado = await etiquetaController.remover(1);

            expect(resultado).toBeUndefined();
            expect(etiquetaService.remover).toHaveBeenCalledWith(1);
        });

        it('deve lançar NotFoundException quando a etiqueta não existe', async () => {
            etiquetaService.remover.mockResolvedValue(null);

            await expect(etiquetaController.remover(999)).rejects.toThrow(NotFoundException);
            expect(etiquetaService.remover).toHaveBeenCalledWith(999);
        });
    });
});
