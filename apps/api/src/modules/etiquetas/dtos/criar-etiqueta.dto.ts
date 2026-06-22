import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

class CriarEtiquetaDto {
    @IsString({ message: 'O nome deve ser uma string' })
    @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
    @MaxLength(50, { message: 'O nome não pode exceder 50 caracteres' })
    @Transform(({ value }) => value.trim())
    nome!: string;
}

export { CriarEtiquetaDto };
