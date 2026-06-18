import { useState } from 'react';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usuario-repository.interface';
import type { CadastrarUsuarioRequest } from '../../shared/models';

function usaRegistrarSeViewModel(usuarioRepository: UsuarioRepositoryInterface, definirAutenticacao: (token: string) => void) {
    const [nome, definirNome] = useState('');
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');
    const [confirmarSenha, definirConfirmarSenha] = useState('');
    const [mensagemErro, definirMensagemErro] = useState('');
    const [carregando, definirCarregando] = useState(false);

    const registrar = async (onSuccess: () => void) => {
        if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
            definirMensagemErro('Preencha todos os campos');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            definirMensagemErro('Email inválido');
            return;
        }

        if (senha.length < 6) {
            definirMensagemErro('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        if (senha !== confirmarSenha) {
            definirMensagemErro('As senhas não coincidem');
            return;
        }

        definirCarregando(true);
        definirMensagemErro('');

        try {
            const dados: CadastrarUsuarioRequest = {
                nomeCompleto: nome.trim(),
                email: email.trim(),
                senha: senha,
            };

            await usuarioRepository.registrarSe(dados);

            const token = await usuarioRepository.entrar(email, senha);
            definirAutenticacao(token);

            onSuccess();
        } catch (error: any) {
            const mensagem = error.response?.data?.message 
                || error.response?.data?.error 
                || 'Erro ao cadastrar. Tente novamente.';

            definirMensagemErro(mensagem);
        } finally {
            definirCarregando(false);
        }
    };

    return {
        nome,
        email,
        senha,
        confirmarSenha,
        mensagemErro,
        carregando,
        definirNome,
        definirEmail,
        definirSenha,
        definirConfirmarSenha,
        registrar,
    };
}

export { usaRegistrarSeViewModel };