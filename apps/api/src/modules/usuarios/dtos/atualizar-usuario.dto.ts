import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { TipoUsuario } from '@monorepo/contracts';
import { CadastrarUsuarioDto } from './cadastrar-usuario.dto';
import { PartialType } from '@nestjs/mapped-types';

class AtualizarUsuarioDto extends PartialType(CadastrarUsuarioDto) {
    @IsOptional()
    @IsEnum(TipoUsuario, { message: 'Tipo inválido' })
    tipo?: TipoUsuario;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export { AtualizarUsuarioDto };
