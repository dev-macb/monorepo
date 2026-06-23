import { render, waitFor } from '@testing-library/react';
import { App } from '../src/app/app';

jest.mock('../src/shared/services/api.service', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
        definirTokenUsuario: jest.fn(),
        removerTokenUsuario: jest.fn(),
        estaAutenticado: jest.fn(),
    },
}));

jest.mock('../src/shared/services/jwt.service', () => ({
    JwtService: {
        obterToken: jest.fn(() => null),
        decodificarToken: jest.fn(),
        definirToken: jest.fn(),
        removerToken: jest.fn(),
    },
}));

describe('App', () => {
    it('deve renderizar sem erros', async () => {
        render(<App />);
        await waitFor(() => {
            expect(true).toBe(true);
        });
    });
});
