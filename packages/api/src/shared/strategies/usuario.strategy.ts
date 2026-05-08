import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../../modules/usuarios/usuario.service';

@Injectable()
export class UsuarioStrategy extends PassportStrategy(Strategy, 'usuario-jwt') {
    constructor(
        configService: ConfigService,
        private readonly usuarioService: UsuarioService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow('USUARIO_JWT'),
        });
    }

    async validate(payload: any) {
        if (!payload.idUsuario || payload.tipoUsuario === undefined) {
            throw new UnauthorizedException('Token inválido para usuário');
        }

        const usuario = await this.usuarioService.obterPorId(payload.idUsuario);

        if (!usuario) {
            throw new UnauthorizedException('Usuário não encontrado');
        }

        if (!usuario.ativo) {
            throw new UnauthorizedException('Usuário desativado');
        }

        return {
            idUsuario: payload.idUsuario,
            tipoUsuario: payload.tipoUsuario,
        };
    }
}
