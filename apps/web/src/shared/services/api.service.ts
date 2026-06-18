import Cookies from 'js-cookie';
import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

const TOKEN_KEY = 'token_usuario';
const URL_BASE_API = import.meta.env.VITE_URL_API || 'http://localhost:3000/';

class ApiService {
    private api;
    private static instance: ApiService;

    private constructor() {
        this.api = axios.create({
            baseURL: URL_BASE_API,
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const token = Cookies.get(TOKEN_KEY);

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: AxiosError) => {
                const url = error.config?.url || '';
                const isLoginRoute = url.includes('/entrar');

                if (error.response?.status === 401 && !isLoginRoute) {
                    Cookies.remove(TOKEN_KEY);
                    if (typeof window !== 'undefined') {
                        window.location.href = '/entrar';
                    }
                }
                return Promise.reject(error);
            },
        );
    }

    public static obterInstancia(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public async get<T>(url: string, params?: object): Promise<T> {
        const resposta = await this.api.get<T>(url, { params });
        return resposta.data;
    }

    public async post<T>(url: string, data?: object): Promise<T> {
        const resposta = await this.api.post<T>(url, data);
        return resposta.data;
    }

    public async put<T>(url: string, data?: object): Promise<T> {
        const resposta = await this.api.put<T>(url, data);
        return resposta.data;
    }

    public async patch<T>(url: string, data?: object): Promise<T> {
        const resposta = await this.api.patch<T>(url, data);
        return resposta.data;
    }

    public async delete<T>(url: string): Promise<T> {
        const resposta = await this.api.delete<T>(url);
        return resposta.data;
    }

    public definirTokenUsuario(token: string): void {
        Cookies.set(TOKEN_KEY, token, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: 'strict',
        });
    }

    public removerTokenUsuario(): void {
        Cookies.remove(TOKEN_KEY);
    }

    public estaAutenticado(): boolean {
        return !!Cookies.get(TOKEN_KEY);
    }
}

const api = ApiService.obterInstancia();

export { api };
