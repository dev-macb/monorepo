import { Module } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { UsuarioGuard } from '../../shared/guards/usuario.guard';
import { Usuario } from './entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioStrategy } from '../../shared/strategies/usuario.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.getOrThrow('USUARIO_JWT'),
                signOptions: { expiresIn: '1h' },
            }),
        }),
        PassportModule,
    ],
    controllers: [UsuarioController],
    providers: [UsuarioService, UsuarioGuard, UsuarioStrategy],
    exports: [UsuarioService, UsuarioGuard],
})
class UsuarioModule {}

export { UsuarioModule };
