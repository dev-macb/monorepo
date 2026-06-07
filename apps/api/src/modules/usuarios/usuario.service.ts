import { ConflictException, Injectable } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { FiltrosUsuarioDto } from './dtos/filtros-usuario.dto';
import { Tabelas } from '../../shared/enums/tabelas.enum';
import { CadastrarUsuarioDto } from './dtos/cadastrar-usuario.dto';
import { SenhaUtil } from '../../shared/utils/senha.util';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { EntrarUsuarioDto } from './dtos/entrar-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repositorio: Repository<Usuario>
    ) {}

    async obterTodos(filtros?: FiltrosUsuarioDto): Promise<Usuario[]> {
        const query = this.repositorio.createQueryBuilder(Tabelas.USUARIOS);

        if (filtros?.nomeCompleto) {
            query.andWhere(`LOWER(${Tabelas.USUARIOS}.nomeCompleto) LIKE LOWER(:nome)`, {
                nome: `%${filtros.nomeCompleto}%`,
            });
        }

        if (filtros?.email) {
            query.andWhere(`LOWER(${Tabelas.USUARIOS}.email) LIKE LOWER(:email)`, {
                email: `%${filtros.email}%`,
            });
        }

        if (filtros?.tipo !== undefined) {
            query.andWhere(`${Tabelas.USUARIOS}.tipo = :tipo`, { tipo: filtros.tipo });
        }

        if (filtros?.ativo !== undefined) {
            query.andWhere(`${Tabelas.USUARIOS}.ativo = :ativo`, { ativo: filtros.ativo });
        }

        query.orderBy(`${Tabelas.USUARIOS}.nomeCompleto`, 'ASC');

        return await query.getMany();
    }

    async obterPorId(id: number): Promise<Usuario | null> {
        const usuario = await this.repositorio.findOneBy({ id });
        if (!usuario) {
            return null;
        }

        return usuario;
    }

    async obterPorEmail(email: string): Promise<Usuario | null> {
        const usuario = await this.repositorio.findOneBy({ email });
        if (!usuario) {
            return null;
        }

        return usuario;
    }

    async cadastrar(dto: CadastrarUsuarioDto): Promise<Usuario> {
        const emailEmUso = await this.obterPorEmail(dto.email);
        if (emailEmUso) {
            throw new ConflictException('Este e-mail já está em uso');
        }

        const usuario = this.repositorio.create(dto);
        usuario.senha = await SenhaUtil.gerarHash(dto.senha);

        return await this.repositorio.save(usuario);
    }

    async atualizar(id: number, dto: AtualizarUsuarioDto): Promise<Usuario | null> {
        const usuario = await this.obterPorId(id);
        if (!usuario) {
            return null;
        }

        if (dto.email && dto.email !== usuario.email) {
            const emailEmUso = await this.obterPorEmail(dto.email);
            if (emailEmUso) {
                throw new ConflictException('Este e-mail já está em uso por outro usuario');
            }
        }

        if (dto.senha) {
            usuario.senha = await SenhaUtil.gerarHash(dto.senha);
        }

        this.repositorio.merge(usuario, dto);
        return await this.repositorio.save(usuario);
    }

    async remover(id: number): Promise<Usuario | null> {
        const usuario = await this.obterPorId(id);
        if (!usuario) {
            return null;
        }

        return this.repositorio.remove(usuario);
    }

    async entrar(dto: EntrarUsuarioDto): Promise<Usuario | null> {
        const usuario = await this.obterPorEmail(dto.email);
        if (!usuario) {
            return null;
        }

        const senhaCorreta = await SenhaUtil.validarHash(dto.senha, usuario.senha);
        if (!senhaCorreta) {
            return null;
        }

        return usuario;
    }
}

export { UsuarioService };
