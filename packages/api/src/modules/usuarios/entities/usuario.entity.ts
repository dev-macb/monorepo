import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Usuarios } from '../../../shared/enums/usuarios.enum';
import { Tabelas } from '../../../shared/enums/tabelas.enum';

@Entity(Tabelas.USUARIOS)
class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ enum: Usuarios, default: Usuarios.PADRAO })
    tipo: Usuarios;

    @Column({ name: 'nome_completo', unique: true })
    nomeCompleto: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    senha: string;

    @Column({ default: true })
    ativo: boolean;

    @CreateDateColumn({ name: 'criado_em' })
    criadoEm: Date;

    @UpdateDateColumn({ name: 'atualizado_em' })
    atualizadoEm: Date;
}

export { Usuario };
