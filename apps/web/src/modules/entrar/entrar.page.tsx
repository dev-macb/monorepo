import './entrar.style.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usaTokenUsuario } from "../../shared/contexts/usuario.context";

const EntrarPage = () => {
    const navigate = useNavigate();
    const { entrar } = usaTokenUsuario();

    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');
    const [mensagemErro, definirMensagemErro] = useState('');

    const tratarEntrar = async (evento: React.FormEvent) => {
        evento.preventDefault();
        definirMensagemErro('');

        const resultado = await entrar(email, senha);

        if (typeof resultado === 'string') {
            definirMensagemErro(resultado);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo-title">Monorepo</span>
                    <span className="login-logo-sub">Preencha seus dados</span>
                </div>
                <form onSubmit={tratarEntrar} className="login-form">
                    <div className="login-field">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(evento) => definirEmail(evento.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(evento) => definirSenha(evento.target.value)}
                            required
                        />
                    </div>
                    {mensagemErro && (
                        <div className="login-erro">
                            {mensagemErro}
                        </div>
                    )}
                    <button type="submit" className="login-btn">
                        Entrar
                    </button>
                </form>

                <div className="login-footer">
                    <span className="login-footer-text">Não tem uma conta?</span>
                    <button
                        type="button"
                        className="login-cadastro-link"
                        onClick={() => { }}
                    >
                        Cadastre-se
                    </button>
                </div>
            </div>
        </div>
    );
};

export { EntrarPage };