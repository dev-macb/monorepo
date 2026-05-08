import './entrar.style.css';
import { useState } from "react";

interface Usuario {
    id: string;
    nome: string;
    handle: string;
    avatarUrl?: string;
}

const EntrarPage = () => {
    const [nome, setNome] = useState('');
    const [handle, setHandle] = useState('');

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-logo-title">Monorepo</span>
                    <span className="login-logo-sub">Preencha seus dados</span>
                </div>
                <form onSubmit={() => {}} className="login-form">
                    <div className="login-field">
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-field">
                        <input
                            type="password"
                            placeholder="Senha"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Entrar
                    </button>
                </form>
                
                <div className="login-footer">
                    <span className="login-footer-text">Não tem uma conta?</span>
                    <button 
                        type="button"
                        className="login-cadastro-link"
                        onClick={() => {}}
                    >
                        Cadastre-se
                    </button>
                </div>
            </div>
        </div>
    );
}

export { EntrarPage };