import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';

class EntrarUsuarioDto {
    @IsEmail({}, { message: 'E-mail inválido' })
    @Transform(({ value }) => value.toLowerCase().trim())
    email!: string;

    @IsString()
    @MaxLength(100, { message: 'A senha não pode exceder 100 caracteres' })
    senha!: string;
}

export { EntrarUsuarioDto };
