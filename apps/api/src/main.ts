import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { DatabaseService } from './data/database.service';

async function bootstrap() {
    config();

    if (process.env.API_ENV !== 'prod') {
        const caminhoDoBanco = join(__dirname, process.env.BASE_NOME || 'base.sqlite');
        if (existsSync(caminhoDoBanco)) {
            unlinkSync(caminhoDoBanco);
        }
    }

    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.API_CORS_ORIGENS?.split(',') || '*',
        allowedHeaders: process.env.API_CORS_CABECALHOS?.split(',') || '*',
        methods: process.env.API_CORS_METODOS?.split(',') || '*',
        credentials: true,
    });

    const databaseService = app.get(DatabaseService);
    await databaseService.executarTodasSeeds();

    await app.listen(process.env.API_PORTA ?? 3000);
}

void bootstrap();
