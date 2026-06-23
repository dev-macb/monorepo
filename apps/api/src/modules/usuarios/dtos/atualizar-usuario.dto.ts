import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TipoUsuario } from '@monorepo/contracts';
import { CadastrarUsuarioDto } from './cadastrar-usuario.dto';
import { PartialType } from '@nestjs/mapped-types';

class AtualizarUsuarioDto extends PartialType(CadastrarUsuarioDto) {
    @IsOptional()
    @IsEmail({}, { message: 'E-mail inválido' })
    @Transform(({ value }) => value.toLowerCase().trim())
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100, { message: 'A senha não pode exceder 100 caracteres' })
    senha?: string;

    @IsOptional()
    @IsEnum(TipoUsuario, { message: 'Tipo inválido' })
    tipo?: TipoUsuario;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export { AtualizarUsuarioDto };
