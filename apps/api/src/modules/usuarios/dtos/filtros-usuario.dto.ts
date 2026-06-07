import { Type } from 'class-transformer';
import { Usuario } from '../entities/usuario.entity';
import { IsOptional, IsBoolean, IsString, MinLength, IsEmail, IsEnum } from 'class-validator';

class FiltrosUsuarioDto {
    @IsOptional()
    @IsString()
    @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    nomeCompleto?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email inválido' })
    email?: string;

    @IsOptional()
    @IsEnum(Usuario, { message: 'Tipo de usuario inválido' })
    tipo?: Usuario;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: 'Ativo deve ser verdadeiro ou falso' })
    ativo?: boolean;
}

export { FiltrosUsuarioDto };
