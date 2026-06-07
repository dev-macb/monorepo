import { AppService } from '../src/app.service';

describe('AppService', () => {
    let appService: AppService;

    beforeEach(() => {
        appService = new AppService();
    });

    describe('obterMensagemOlaMundo', () => {
        it('deve retornar uma mensagem "Olá, Mundo!"', () => {
            const resultado = appService.obterMensagemOlaMundo();

            expect(resultado).toBeDefined();
            expect(resultado.mensagem).toBe('Olá, Mundo!');
        });

        it('deve retornar uma data válida', () => {
            const resultado = appService.obterMensagemOlaMundo();

            expect(resultado.data).toBeInstanceOf(Date);
            expect(resultado.data).toBeDefined();
        });

        it('deve retornar a data atual (aproximadamente)', () => {
            const antes = new Date();
            const resultado = appService.obterMensagemOlaMundo();
            const depois = new Date();

            expect(resultado.data.getTime()).toBeGreaterThanOrEqual(antes.getTime());
            expect(resultado.data.getTime()).toBeLessThanOrEqual(depois.getTime());
        });
    });
});
