import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tabelas } from '../../../shared/enums/tabelas.enum';

@Entity(Tabelas.ETIQUETAS)
class Etiqueta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nome: string;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}

export { Etiqueta };
