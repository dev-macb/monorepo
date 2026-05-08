import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLICO } from '../decorators/permissoes.decorator';
import { Usuarios } from '../enums/usuarios.enum';
import { USUARIO_PERMISSOES } from '../decorators/permissoes.decorator';

@Injectable()
export class UsuarioGuard extends AuthGuard('usuario-jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Verifica se a rota é pública
        const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLICO, [context.getHandler(), context.getClass()]);

        if (isPublic) {
            return true;
        }

        const podeAtivar = await super.canActivate(context);
        if (!podeAtivar) {
            throw new UnauthorizedException('Token de usuário inválido ou expirado');
        }

        const request = context.switchToHttp().getRequest();
        const usuario = request.user;

        if (!usuario || usuario.tipoUsuario === undefined) {
            throw new UnauthorizedException('Usuário não autenticado');
        }

        const permissoesRequeridas = this.reflector.get<Usuarios[]>(USUARIO_PERMISSOES, context.getHandler());

        if (!permissoesRequeridas || permissoesRequeridas.length === 0) {
            return true;
        }

        const possuiPermissao = permissoesRequeridas.includes(usuario.tipoUsuario);
        if (!possuiPermissao) {
            throw new ForbiddenException('Você não tem permissão para acessar este recurso');
        }

        return true;
    }
}
