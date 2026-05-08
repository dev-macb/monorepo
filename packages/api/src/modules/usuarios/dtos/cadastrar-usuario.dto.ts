import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Usuarios } from '../../../shared/enums/usuarios.enum';

class CadastrarUsuarioDto {
    @IsEnum(Usuarios, { message: 'Tipo de usuário inválido' })
    @IsOptional()
    tipo?: Usuarios;

    @IsString()
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(255, { message: 'O nome não pode exceder 255 caracteres' })
    @Transform(({ value }) => value.trim())
    nomeCompleto!: string;

    @IsEmail({}, { message: 'E-mail inválido' })
    @Transform(({ value }) => value.toLowerCase().trim())
    email!: string;

    @IsString()
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    @MaxLength(100, { message: 'A senha não pode exceder 100 caracteres' })
    senha!: string;

    @IsBoolean({ message: 'Ativo deve ser um valor booleano' })
    @IsOptional()
    ativo?: boolean;
}

export { CadastrarUsuarioDto };
