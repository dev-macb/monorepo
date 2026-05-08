import { DataSource } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Usuario } from '../modules/usuarios/entities/usuario.entity';
import { Tabelas } from '../shared/enums/tabelas.enum';
import { UsuariosSeed } from './seeds/usuario.seed';

@Injectable()
class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {}

    async executarTodasSeeds(): Promise<void> {
        this.logger.log('Iniciando população do banco de dados...');

        try {
            await this.popularUsuarios();

            this.logger.log('Todas as seeds foram executadas com sucesso!');
        } catch (erro) {
            this.logger.error('Erro ao executar seeds:', erro);
            throw erro;
        }
    }

    async popularUsuarios(): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const quantidade = await manager.count(Usuario);
            if (quantidade > 0) {
                this.logger.warn(`Tabela ${Tabelas.USUARIOS} já contém dados. Pulando seed.`);
                return;
            }

            const dados = await UsuariosSeed.obter();

            const registros = dados.map((item: any) => manager.create(Usuario, item));
            await manager.save(registros);

            this.logger.log(`${registros.length} registro(s) inserido(s) na tabela ${Tabelas.USUARIOS}`);
        });
    }

    async limparTodasTabelas(): Promise<void> {
        if (process.env.API_ENV === 'prod') {
            throw new Error('Operação não permitida em produção!');
        }

        this.logger.warn('Limpando todas as tabelas...');

        await this.dataSource.transaction(async (manager) => {
            await manager.delete(Usuario, {});
        });

        this.logger.log('Todas as tabelas foram limpas');
    }

    async resetarBancoDados(): Promise<void> {
        if (process.env.NODE_ENV === 'prod') {
            throw new Error('Operação não permitida em produção!');
        }

        this.logger.warn('Resetando banco de dados...');

        await this.limparTodasTabelas();
        await this.executarTodasSeeds();

        this.logger.log('Banco de dados resetado com sucesso!');
    }
}

export { DatabaseService };
