import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { api } from '../services/api.service';
import { Outlet } from 'react-router-dom';

interface IUsuarioToken {
    idUsuario: number;
    tipoUsuario: number;
}

interface IUsuarioContext {
    usuario: IUsuarioToken | null;
    carregando: boolean;
    estaAutenticado: boolean;
    entrar: (email: string, senha: string) => Promise<string | void>;
    sair: () => void;
}

const UsuarioContext = createContext<IUsuarioContext | undefined>(undefined);

const UsuarioProvider = ({ children }: { children?: React.ReactNode }) => {
    const [usuario, definirUsuario] = useState<IUsuarioToken | null>(null);
    const [carregando, definirCarregando] = useState(true);

    useEffect(() => {
        const token = Cookies.get('token_usuario');

        if (token) {
            try {
                const tokenDecodificado = jwtDecode<IUsuarioToken>(token);
                definirUsuario(tokenDecodificado);
                api.definirToken(token);
            } catch {
                Cookies.remove('token_usuario');
            }
        }

        definirCarregando(false);
    }, []);

    const entrar = async (email: string, senha: string) => {
        try {
            sair();

            const entrarUsuarioDto = { email, senha };
            const resposta = await api.post<{ token_usuario: string }>('/usuarios/entrar', entrarUsuarioDto);

            api.definirToken(resposta.token_usuario);

            const tokenDecodificado = jwtDecode<IUsuarioToken>(resposta.token_usuario);
            definirUsuario(tokenDecodificado);
        } catch (erro: any) {
            return erro.response?.data?.message || erro.response?.data?.error || 'Erro desconhecido';
        }
    };

    const sair = () => {
        definirUsuario(null);
        Cookies.remove('token_usuario');
        api.removerToken();
    };

    return (
        <UsuarioContext.Provider value={{ usuario, carregando, estaAutenticado: !!usuario, entrar, sair }}>
            {children ?? <Outlet />}
        </UsuarioContext.Provider>
    );
};

const usaTokenUsuario = () => {
    const context = useContext(UsuarioContext);
    if (!context) {
        throw new Error('usaTokenUsuario deve ser usado dentro de UsuarioProvider');
    }
    return context;
};

export { UsuarioContext, UsuarioProvider, usaTokenUsuario };