import { Type } from 'class-transformer';
import { IsOptional, IsBoolean, IsString, MinLength, IsEmail, IsEnum } from 'class-validator';
import { PapelUsuario } from '@monorepo/contracts';

class FiltrosUsuarioDto {
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    nomeCompleto?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email inválido' })
    email?: string;

    @IsOptional()
    @IsEnum(PapelUsuario, { message: 'Tipo de usuário inválido' })
    tipo?: PapelUsuario;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
    ativo?: boolean;
}

export { FiltrosUsuarioDto };
