import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Etiqueta } from './entities/etiqueta.entity';
import { CriarEtiquetaDto } from './dtos/criar-etiqueta.dto';
import { AtualizarEtiquetaDto } from './dtos/atualizar-etiqueta.dto';

@Injectable()
class EtiquetaService {
    constructor(
        @InjectRepository(Etiqueta)
        private readonly repositorio: Repository<Etiqueta>
    ) {}

    async criar(dto: CriarEtiquetaDto): Promise<Etiqueta | null> {
        const existente = await this.repositorio.findOneBy({ nome: dto.nome });
        if (existente) {
            return null;
        }

        const etiqueta = this.repositorio.create(dto);
        return await this.repositorio.save(etiqueta);
    }

    async obterTodos(): Promise<Etiqueta[]> {
        return await this.repositorio.find({ order: { nome: 'ASC' } });
    }

    async obterPorId(id: number): Promise<Etiqueta | null> {
        return await this.repositorio.findOneBy({ id });
    }

    async atualizar(id: number, dto: AtualizarEtiquetaDto): Promise<Etiqueta | null> {
        const etiqueta = await this.obterPorId(id);
        if (!etiqueta) {
            return null;
        }

        if (dto.nome && dto.nome !== etiqueta.nome) {
            const existente = await this.repositorio.findOneBy({ nome: dto.nome });
            if (existente) {
                return null;
            }
        }

        this.repositorio.merge(etiqueta, dto);
        return await this.repositorio.save(etiqueta);
    }

    async remover(id: number): Promise<Etiqueta | null> {
        const etiqueta = await this.obterPorId(id);
        if (!etiqueta) {
            return null;
        }

        return this.repositorio.remove(etiqueta);
    }
}

export { EtiquetaService };
