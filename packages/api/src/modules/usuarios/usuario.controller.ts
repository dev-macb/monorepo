import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UnauthorizedException, NotFoundException, UseGuards, InternalServerErrorException, Query } from '@nestjs/common';
import { Usuarios } from '../../shared/enums/usuarios.enum';
import { Rotas } from '../../shared/enums/rotas.enum';
import { UsuarioService } from './usuario.service';
import { FiltrosUsuarioDto } from './dtos/filtros-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { CadastrarUsuarioDto } from './dtos/cadastrar-usuario.dto';
import { EntrarUsuarioDto } from './dtos/entrar-usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { Publico, UsuarioPermissoes } from '../../shared/decorators/permissoes.decorator';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { UsuarioGuard } from '../../shared/guards/usuario.guard';

@Controller(Rotas.USUARIOS)
class UsuarioController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usuarioService: UsuarioService
    ) {}

    @Get()
    @UseGuards(UsuarioGuard)
    @UsuarioPermissoes(Usuarios.ADMINISTRADOR, Usuarios.PADRAO)
    async obterTodos(@Query() filtros?: FiltrosUsuarioDto): Promise<Omit<Usuario, 'senha'>[]> {
        const administradores = await this.usuarioService.obterTodos(filtros);
        return administradores.map(({ senha: _, ...administradoresSemSenha }) => administradoresSemSenha);
    }

    @Get(':id')
    @UseGuards(UsuarioGuard)
    @UsuarioPermissoes(Usuarios.ADMINISTRADOR, Usuarios.PADRAO)
    async obterPorId(@Param('id') id: number): Promise<Omit<Usuario, 'senha'> | null> {
        const administrador = await this.usuarioService.obterPorId(id);
        if (!administrador) {
            throw new NotFoundException('Usuario inexistente');
        }

        const { senha: _, ...administradorSemSenha } = administrador;

        return administradorSemSenha;
    }

    @Post()
    @UseGuards(UsuarioGuard)
    @UsuarioPermissoes(Usuarios.ADMINISTRADOR, Usuarios.PADRAO)
    async cadastrar(@Body() dto: CadastrarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const novoUsuario = await this.usuarioService.cadastrar(dto);
        if (!novoUsuario) {
            throw new InternalServerErrorException('Erro ao cadastrar usuário');
        }

        const { senha: _, ...administradorSemSenha } = novoUsuario;

        return administradorSemSenha;
    }

    @Patch(':id')
    @UseGuards(UsuarioGuard)
    @UsuarioPermissoes(Usuarios.ADMINISTRADOR, Usuarios.PADRAO)
    async atualizar(@Param('id') id: number, @Body() dto: AtualizarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const administradorAtualizado = await this.usuarioService.atualizar(id, dto);
        if (!administradorAtualizado) {
            throw new NotFoundException('Usuario inexistente');
        }

        const { senha: _, ...administradorSemSenha } = administradorAtualizado;

        return administradorSemSenha;
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(UsuarioGuard)
    @UsuarioPermissoes(Usuarios.ADMINISTRADOR)
    async remover(@Param('id') id: number): Promise<void> {
        const administrador = await this.usuarioService.remover(id);
        if (!administrador) {
            throw new NotFoundException('Usuario inexistente');
        }
    }

    @Publico()
    @Post('entrar')
    @HttpCode(200)
    async entrar(@Body() dto: EntrarUsuarioDto): Promise<{ token_usuario: string }> {
        const administrador = await this.usuarioService.entrar(dto);
        if (!administrador) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!administrador.ativo) {
            throw new UnauthorizedException('Usuario inativo');
        }

        const payload = {
            idUsuario: administrador.id,
            tipoUsuario: administrador.tipo,
        };
        const token = this.jwtService.sign(payload);

        return { token_usuario: token };
    }
}

export { UsuarioController };
