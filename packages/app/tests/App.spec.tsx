import { render, waitFor } from '@testing-library/react';
import { App } from '../src/App';

// Mock do fetch antes de todos os testes
beforeAll(() => {
    (globalThis as any).fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ mensagem: 'Olá', data: new Date() }),
        })
    ) as jest.Mock;
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('App', () => {
    it('deve renderizar sem erros', async () => {
        render(<App />);
        await waitFor(() => {
            expect(true).toBe(true);
        });
    });
});
