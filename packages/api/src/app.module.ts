import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './modules/usuarios/usuario.module';
import { DatabaseService } from './data/database.service';
import { LoggerUtil } from './shared/utils/logger.util';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core/constants';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [join(process.cwd(), '../../.env')],
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: '../../base.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true, // Para desenvolvimento
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
                blockDuration: 60000,
            },
        ]),
        LoggerModule.forRoot({
            pinoHttp: {
                formatters: { level: (label) => ({ level: label }) },
                base: null,
                timestamp: () =>
                    `,"timestamp":"${new Date()
                        .toLocaleString('pt-BR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })
                        .replace(',', '')}"`,
                messageKey: 'msg',
            },
        }),
        UsuarioModule,
    ],
    providers: [
        AppService,
        DatabaseService,
        LoggerUtil,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    controllers: [AppController],
    exports: [AppService, DatabaseService, LoggerUtil],
})
class AppModule {}

export { AppModule };
