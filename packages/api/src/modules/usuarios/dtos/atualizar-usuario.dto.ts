import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Usuarios } from '../../../shared/enums/usuarios.enum';
import { CadastrarUsuarioDto } from './cadastrar-usuario.dto';
import { PartialType } from '@nestjs/mapped-types';

class AtualizarUsuarioDto extends PartialType(CadastrarUsuarioDto) {
    @IsOptional()
    @IsEnum(Usuarios, { message: 'Tipo inválido' })
    tipo?: Usuarios;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export { AtualizarUsuarioDto };
