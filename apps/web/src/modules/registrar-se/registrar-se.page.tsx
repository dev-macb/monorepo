import './registrar-se.style.css';
import { useNavigate } from 'react-router-dom';
import { usaDependencias } from '../../shared/di/container';
import { usaRegistrarSeViewModel } from './registrar-se.viewmodel';

function RegistrarSePage() {
    const navigate = useNavigate();
    const { usuarioRepository } = usaDependencias();
    const {
        nome, email, senha, confirmarSenha,
        mensagemErro, carregando,
        definirNome, definirEmail, definirSenha, definirConfirmarSenha,
        registrar,
    } = usaRegistrarSeViewModel(usuarioRepository);

    const tratarRegistrarSe = async (evento: React.FormEvent) => {
        evento.preventDefault();
        await registrar(() => navigate('/'));
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo-title">Monorepo</span>
                    <span className="login-logo-sub">Crie sua conta</span>
                </div>
                <form onSubmit={tratarRegistrarSe} className="login-form">
                    <div className="login-field">
                        <input
                            type="text"
                            placeholder="Nome completo"
                            value={nome}
                            onChange={(evento) => definirNome(evento.target.value)}
                            required
                        />
                    </div>
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
                            minLength={6}
                        />
                    </div>
                    <div className="login-field">
                        <input
                            type="password"
                            placeholder="Confirmar senha"
                            value={confirmarSenha}
                            onChange={(evento) => definirConfirmarSenha(evento.target.value)}
                            required
                            minLength={6}
                        />
                    </div>
                    {mensagemErro && (
                        <div className="login-erro">
                            {mensagemErro}
                        </div>
                    )}
                    <button type="submit" className="login-btn" disabled={carregando}>
                        {carregando ? 'Cadastrando…' : 'Cadastrar'}
                    </button>
                </form>

                <div className="login-footer">
                    <span className="login-footer-text">Já tem uma conta?</span>
                    <button type="button" className="login-cadastro-link" onClick={() => navigate('/entrar')}>
                        Entrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export { RegistrarSePage };