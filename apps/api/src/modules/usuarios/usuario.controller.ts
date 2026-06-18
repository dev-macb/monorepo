import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UnauthorizedException, NotFoundException, ConflictException, UseGuards, InternalServerErrorException, Query } from '@nestjs/common';
import { TipoUsuario } from '@monorepo/contracts';
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

@UseGuards(UsuarioGuard)
@Controller(Rotas.USUARIOS)
class UsuarioController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usuarioService: UsuarioService
    ) { }

    @Publico()
    @Post('entrar')
    @HttpCode(200)
    async entrar(@Body() dto: EntrarUsuarioDto): Promise<{ token_usuario: string }> {
        const usuario = await this.usuarioService.entrar(dto);
        if (!usuario) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        if (!usuario.ativo) {
            throw new UnauthorizedException('Usuário inativo');
        }

        const payload = {
            idUsuario: usuario.id,
            tipoUsuario: usuario.tipo,
        };
        const token = this.jwtService.sign(payload);

        return { token_usuario: token };
    }

    @Publico()
    @Post('registrar-se')
    @HttpCode(201)
    async registrarSe(@Body() dto: CadastrarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const novoUsuario = await this.usuarioService.cadastrar(dto);
        if (!novoUsuario) {
            throw new ConflictException('Este e-mail já está em uso');
        }

        const { senha: _, ...usuarioSemSenha } = novoUsuario;

        return usuarioSemSenha;
    }

    @Patch(':id/desativar')
    @HttpCode(200)
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async desativarConta(@Param('id') id: number): Promise<{ message: string }> {
        const usuario = await this.usuarioService.desativarConta(id);
        if (!usuario) {
            throw new NotFoundException('Usuário inexistente');
        }

        return { message: 'Conta desativada com sucesso' };
    }

    @Get()
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async obterTodos(@Query() filtros?: FiltrosUsuarioDto): Promise<Omit<Usuario, 'senha'>[]> {
        const usuarios = await this.usuarioService.obterTodos(filtros);
        return usuarios.map(({ senha: _, ...usuarioSemSenha }) => usuarioSemSenha);
    }

    @Get(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async obterPorId(@Param('id') id: number): Promise<Omit<Usuario, 'senha'>> {
        const usuario = await this.usuarioService.obterPorId(id);
        if (!usuario) {
            throw new NotFoundException('Usuário inexistente');
        }

        const { senha: _, ...usuarioSemSenha } = usuario;

        return usuarioSemSenha;
    }

    @Post()
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async cadastrar(@Body() dto: CadastrarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const novoUsuario = await this.usuarioService.cadastrar(dto);
        if (!novoUsuario) {
            throw new ConflictException('Este e-mail já está em uso');
        }

        const { senha: _, ...usuarioSemSenha } = novoUsuario;

        return usuarioSemSenha;
    }

    @Patch(':id')
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR, TipoUsuario.PADRAO)
    async atualizar(@Param('id') id: number, @Body() dto: AtualizarUsuarioDto): Promise<Omit<Usuario, 'senha'>> {
        const usuarioAtualizado = await this.usuarioService.atualizar(id, dto);
        if (!usuarioAtualizado) {
            throw new NotFoundException('Usuário inexistente');
        }

        const { senha: _, ...usuarioSemSenha } = usuarioAtualizado;

        return usuarioSemSenha;
    }

    @Delete(':id')
    @HttpCode(204)
    @UsuarioPermissoes(TipoUsuario.ADMINISTRADOR)
    async remover(@Param('id') id: number): Promise<void> {
        const usuario = await this.usuarioService.remover(id);
        if (!usuario) {
            throw new NotFoundException('Usuário inexistente');
        }
    }
}

export { UsuarioController };
