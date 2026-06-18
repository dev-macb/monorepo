import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import type { TokenPayload } from '../models';

const TOKEN_KEY = 'token_usuario';

class JwtService {
    public static obterToken(): string | null {
        return Cookies.get(TOKEN_KEY) ?? null;
    }

    public static definirToken(token: string): void {
        Cookies.set(TOKEN_KEY, token, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
        });
    }

    public static removerToken(): void {
        Cookies.remove(TOKEN_KEY);
    }

    public static decodificarToken(token: string): TokenPayload {
        return jwtDecode<TokenPayload>(token);
    }

    public static estaAutenticado(): boolean {
        return !!Cookies.get(TOKEN_KEY);
    }
}

export { JwtService };
