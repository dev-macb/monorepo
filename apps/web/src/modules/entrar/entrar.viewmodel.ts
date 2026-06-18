import { useState } from 'react';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usuario-repository.interface';

function usaEntrarViewModel(usuarioRepository: UsuarioRepositoryInterface, definirAutenticacao: (token: string) => void) {
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');
    const [mensagemErro, definirMensagemErro] = useState('');
    const [carregando, definirCarregando] = useState(false);

    const login = async (onSuccess: () => void) => {
        if (!email.trim() || !senha.trim()) {
            definirMensagemErro('Preencha todos os campos');
            return;
        }

        definirCarregando(true);
        definirMensagemErro('');

        try {
            const tokenUsuario = await usuarioRepository.entrar(email, senha);
            definirAutenticacao(tokenUsuario);
            onSuccess();
        } catch (error: any) {
            const mensagem = error.response?.data?.message
                || error.response?.data?.error
                || 'Erro desconhecido';

            definirMensagemErro(mensagem);
        } finally {
            definirCarregando(false);
        }
    };

    return {
        email,
        senha,
        mensagemErro,
        carregando,
        definirEmail,
        definirSenha,
        login,
    };
}

export { usaEntrarViewModel };
