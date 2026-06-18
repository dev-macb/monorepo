import { createContext, useContext, useState, useEffect } from 'react';
import type { TokenPayload } from '../models';
import { JwtService } from '../services/jwt.service';

interface AutenticacaoContextType {
    payload: TokenPayload | null;
    carregando: boolean;
    isAuthenticated: boolean;
    sair: () => void;
    definirAutenticacao: (token: string) => void;
}

const AutenticacaoContext = createContext<AutenticacaoContextType | undefined>(undefined);

function AutenticacaoProvider({ children }: { children?: React.ReactNode }) {
    const [payload, setPayload] = useState<TokenPayload | null>(null);
    const [carregando, definirCarregando] = useState(true);

    useEffect(() => {
        const tokenUsuario = JwtService.obterToken();

        if (tokenUsuario) {
            try {
                const decoded = JwtService.decodificarToken(tokenUsuario);
                setPayload(decoded);
                JwtService.definirToken(tokenUsuario);
            } catch {
                JwtService.removerToken();
            }
        }

        definirCarregando(false);
    }, []);

    const sair = () => {
        setPayload(null);
        JwtService.removerToken();
    };

    const definirAutenticacao = (token: string) => {
        const decoded = JwtService.decodificarToken(token);
        setPayload(decoded);
        JwtService.definirToken(token);
    };

    return (
        <AutenticacaoContext.Provider value={{ payload, carregando, isAuthenticated: !!payload, sair, definirAutenticacao }}>
            {children}
        </AutenticacaoContext.Provider>
    );
}

function usaAutenticacao() {
    const contexto = useContext(AutenticacaoContext);
    if (!contexto) {
        throw new Error('usaAutenticacao deve ser usado dentro de AutenticacaoProvider');
    }
    return contexto;
}

export { AutenticacaoContext, AutenticacaoProvider, usaAutenticacao };
