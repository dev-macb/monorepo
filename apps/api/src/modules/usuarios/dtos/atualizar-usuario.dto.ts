import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { PapelUsuario } from '@monorepo/contracts';
import { CadastrarUsuarioDto } from './cadastrar-usuario.dto';
import { PartialType } from '@nestjs/mapped-types';

class AtualizarUsuarioDto extends PartialType(CadastrarUsuarioDto) {
    @IsOptional()
    @IsEnum(PapelUsuario, { message: 'Tipo inválido' })
    tipo?: PapelUsuario;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export { AtualizarUsuarioDto };
