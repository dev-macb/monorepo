import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { EntrarPage } from '../../src/modules/entrar/entrar.page';

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

let viewModelMock: {
    email: string;
    senha: string;
    mensagemErro: string;
    carregando: boolean;
    definirEmail: jest.Mock;
    definirSenha: jest.Mock;
    login: jest.Mock;
};

jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

jest.mock('../../src/modules/entrar/entrar.viewmodel', () => ({
    usaEntrarViewModel: () => viewModelMock,
}));

jest.mock('../../src/shared/di/container', () => ({
    usaDependencias: () => ({ usuarioRepository: {} }),
}));

jest.mock('../../src/shared/contexts/autenticacao.context', () => ({
    usaAutenticacao: () => ({ definirAutenticacao: jest.fn() }),
}));

function criarViewModel() {
    return {
        email: '',
        senha: '',
        mensagemErro: '',
        carregando: false,
        definirEmail: jest.fn(),
        definirSenha: jest.fn(),
        login: mockLogin,
    };
}

describe('EntrarPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        viewModelMock = criarViewModel();
    });

    it('deve renderizar o formulario de login', () => {
        render(<EntrarPage />);

        expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
    });

    it('deve chamar definirEmail ao digitar no campo email', () => {
        render(<EntrarPage />);

        fireEvent.change(screen.getByPlaceholderText('E-mail'), {
            target: { value: 'teste@email.com' },
        });

        expect(viewModelMock.definirEmail).toHaveBeenCalledWith('teste@email.com');
    });

    it('deve chamar definirSenha ao digitar no campo senha', () => {
        render(<EntrarPage />);

        fireEvent.change(screen.getByPlaceholderText('Senha'), {
            target: { value: 'minha-senha' },
        });

        expect(viewModelMock.definirSenha).toHaveBeenCalledWith('minha-senha');
    });

    it('deve chamar login ao submeter o formulario', () => {
        render(<EntrarPage />);

        const formulario = screen.getByRole('button', { name: 'Entrar' }).closest('form')!;
        fireEvent.submit(formulario);

        expect(mockLogin).toHaveBeenCalledTimes(1);
        expect(mockLogin).toHaveBeenCalledWith(expect.any(Function));
    });

    it('deve exibir mensagem de erro quando houver', () => {
        viewModelMock.mensagemErro = 'Credenciais inválidas';

        render(<EntrarPage />);

        expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    it('deve desabilitar o botao quando carregando', () => {
        viewModelMock.carregando = true;

        render(<EntrarPage />);

        const botao = screen.getByRole('button', { name: /Entrando/ });
        expect(botao).toBeDisabled();
    });

    it('deve navegar para /registrar-se ao clicar em Cadastre-se', () => {
        render(<EntrarPage />);

        fireEvent.click(screen.getByText('Cadastre-se'));

        expect(mockNavigate).toHaveBeenCalledWith('/registrar-se');
    });

    it('deve exibir logo e subtitulo', () => {
        render(<EntrarPage />);

        expect(screen.getByText('Monorepo')).toBeInTheDocument();
        expect(screen.getByText('Preencha seus dados')).toBeInTheDocument();
        expect(screen.getByText(/tem uma conta/i)).toBeInTheDocument();
    });
});
