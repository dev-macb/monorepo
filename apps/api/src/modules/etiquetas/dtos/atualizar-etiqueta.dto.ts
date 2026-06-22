import { PartialType } from '@nestjs/mapped-types';
import { CriarEtiquetaDto } from './criar-etiqueta.dto';

class AtualizarEtiquetaDto extends PartialType(CriarEtiquetaDto) {}

export { AtualizarEtiquetaDto };
