import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = module.get<AppController>(AppController);
        appService = module.get<AppService>(AppService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('testeOlaMundo', () => {
        it('deve retornar o resultado do serviço', () => {
            const mockResponse = { mensagem: 'Olá, Mundo!', data: new Date() };
            jest.spyOn(appService, 'obterMensagemOlaMundo').mockReturnValue(mockResponse);

            const resultado = appController.testeOlaMundo();

            expect(resultado).toBe(mockResponse);
            expect(appService.obterMensagemOlaMundo).toHaveBeenCalled();
        });

        it('deve retornar um objeto com mensagem e data', () => {
            const resultado = appController.testeOlaMundo();

            expect(resultado).toHaveProperty('mensagem');
            expect(resultado).toHaveProperty('data');
            expect(typeof resultado.mensagem).toBe('string');
            expect(resultado.data).toBeInstanceOf(Date);
        });

        it('deve chamar o serviço uma vez', () => {
            const spy = jest.spyOn(appService, 'obterMensagemOlaMundo');

            appController.testeOlaMundo();

            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
