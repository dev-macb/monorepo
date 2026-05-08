import Cookies from 'js-cookie';
import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

const CHAVE_TOKEN = 'token_usuario';
const URL_BASE_API = import.meta.env.VITE_URL_API || 'http://localhost:3000/';

class ServicoApi {
    private api;
    private static instancia: ServicoApi;

    private constructor() {
        this.api = axios.create({
            baseURL: URL_BASE_API,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.api.interceptors.request.use((configuracao: InternalAxiosRequestConfig) => {
            const token = Cookies.get(CHAVE_TOKEN);

            if (token) {
                configuracao.headers.Authorization = `Bearer ${token}`;
            }

            return configuracao;
        });

        this.api.interceptors.response.use(
            (resposta: AxiosResponse) => resposta,
            async (erro: AxiosError) => {
                const url = erro.config?.url || '';
                const ehRotaDeLogin = url.includes('/entrar');

                if (erro.response?.status === 401 && !ehRotaDeLogin) {
                    Cookies.remove(CHAVE_TOKEN);
                    if (typeof window !== 'undefined') {
                        window.location.href = '/admin/entrar';
                    }
                }
                return Promise.reject(erro);
            },
        );
    }

    public static obterInstancia(): ServicoApi {
        if (!ServicoApi.instancia) {
            ServicoApi.instancia = new ServicoApi();
        }
        return ServicoApi.instancia;
    }

    public async get<T>(url: string, parametros?: object): Promise<T> {
        const resposta = await this.api.get<T>(url, { params: parametros });
        return resposta.data;
    }

    public async post<T>(url: string, dados?: object): Promise<T> {
        const resposta = await this.api.post<T>(url, dados);
        return resposta.data;
    }

    public async put<T>(url: string, dados?: object): Promise<T> {
        const resposta = await this.api.put<T>(url, dados);
        return resposta.data;
    }

    public async patch<T>(url: string, dados?: object): Promise<T> {
        const resposta = await this.api.patch<T>(url, dados);
        return resposta.data;
    }

    public async deletar<T>(url: string): Promise<T> {
        const resposta = await this.api.delete<T>(url);
        return resposta.data;
    }

    public definirToken(token: string): void {
        Cookies.set(CHAVE_TOKEN, token, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
        });
    }

    public removerToken(): void {
        Cookies.remove(CHAVE_TOKEN);
    }

    public estaAutenticado(): boolean {
        return !!Cookies.get(CHAVE_TOKEN);
    }
}

const api = ServicoApi.obterInstancia();

export { api };
