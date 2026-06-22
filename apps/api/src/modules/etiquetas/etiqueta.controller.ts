import { Body, ConflictException, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TipoUsuario } from '@monorepo/contracts';
import { Rotas } from '../../shared/enums/rotas.enum';
import { Publico, UsuarioPermissoes } from '../../shared/decorators/permissoes.decorator';
import { UsuarioGuard } from '../../shared/guards/usuario.guard';
import { EtiquetaService } from './etiqueta.service';
import { CriarEtiquetaDto } from './dtos/criar-etiqueta.dto';
import { AtualizarEtiquetaDto } from './dtos/atualizar-etiqueta.dto';

@UseGuards(UsuarioGuard)
@Controller(Rotas.ETIQUETAS)
class EtiquetaController {
    constructor(private readonly etiquetaService: EtiquetaService) {}

    @Publico()
    @Get()
    async obterTodos() {
        return await this.etiquetaService.obterTodos();
    }

    @Publico()
    @Get(':id')
    async obterPorId(@Param('id') id: number) {
        const etiqueta = await this.etiquetaService.obterPorId(id);
        if (!etiqueta) {
            throw new NotFoundException('Etiqueta inexistente');
        }

        return etiqueta;
    }

    @Post()
    async criar(@Body() dto: CriarEtiquetaDto) {
        const etiqueta = await this.etiquetaService.criar(dto);
        if (!etiqueta) {
            throw new ConflictException('Esta etiqueta já existe');
        }

        return etiqueta;
    }

    @Patch(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async atualizar(@Param('id') id: number, @Body() dto: AtualizarEtiquetaDto) {
        const etiqueta = await this.etiquetaService.atualizar(id, dto);
        if (!etiqueta) {
            const existe = await this.etiquetaService.obterPorId(id);
            if (!existe) {
                throw new NotFoundException('Etiqueta inexistente');
            }
            throw new ConflictException('Esta etiqueta já existe');
        }

        return etiqueta;
    }

    @Delete(':id')
    @HttpCode(204)
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async remover(@Param('id') id: number): Promise<void> {
        const etiqueta = await this.etiquetaService.remover(id);
        if (!etiqueta) {
            throw new NotFoundException('Etiqueta inexistente');
        }
    }
}

export { EtiquetaController };
