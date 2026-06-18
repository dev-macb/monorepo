import './entrar.style.css';
import { useNavigate } from "react-router-dom";
import { usaDependencias } from "../../shared/di/container";
import { usaEntrarViewModel } from "./entrar.viewmodel";

function EntrarPage() {
    const navigate = useNavigate();
    const { usuarioRepository } = usaDependencias();
    const { 
        email, 
        senha, 
        mensagemErro, 
        carregando, 
        definirEmail, 
        definirSenha, 
        login 
    } = usaEntrarViewModel(usuarioRepository);

    const tratarLogin = async (evento: React.FormEvent) => {
        evento.preventDefault();
        await login(() => navigate('/'));
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo-title">Monorepo</span>
                    <span className="login-logo-sub">Preencha seus dados</span>
                </div>

                <form onSubmit={tratarLogin} className="login-form">
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

                    <button type="submit" className="login-btn" disabled={carregando}>
                        {carregando ? 'Entrando…' : 'Entrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="login-footer-text">Não tem uma conta?</span>
                    <button type="button" className="login-cadastro-link" onClick={() => navigate('/registrar-se')}>
                        Cadastre-se
                    </button>
                </div>
            </div>
        </div>
    );
}

export { EntrarPage };
