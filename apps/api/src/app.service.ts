import { Injectable } from '@nestjs/common';
import { OlaMundoResponse } from './shared/types';

@Injectable()
class AppService {
    obterMensagemOlaMundo(): OlaMundoResponse {
        return { mensagem: 'Olá, Mundo!', data: new Date() };
    }
}

export { AppService };
