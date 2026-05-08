import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import type { OlaMundoResponse } from './shared/types';

@Controller()
class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('ola-mundo')
    testeOlaMundo(): OlaMundoResponse {
        return this.appService.obterMensagemOlaMundo();
    }
}

export { AppController };
