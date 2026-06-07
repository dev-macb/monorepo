import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './menu-lateral.style.css';
import { iniciais } from '../../utils/formatador.util';

interface ItemMenu {
    icone: string;
    texto: string;
    ativo?: boolean;
    onClick?: () => void;
}

interface MenuLateralProps {
    titulo: string;
    subTitulo: string;
    itens: ItemMenu[];
    usuarioAtual?: {
        id?: string;
        tipo?: number;
        nomeCompleto?: string;
        email?: string;
        senha?: string;
        ativo?: boolean;
        criadoEm?: string;
        atualizadoEm?: string;
    } | null;
    estaAutenticado: boolean;
    onSair: () => void;
    onAbrirPerfil?: () => void;
}

function MenuLateral({ titulo, subTitulo, itens, usuarioAtual, estaAutenticado, onSair, onAbrirPerfil }: MenuLateralProps) {
    const [menuUsuarioAberto, setMenuUsuarioAberto] = useState(false);
    const navigate = useNavigate();

    const tratarAbrirPerfil = () => {
        setMenuUsuarioAberto(false);
        if (onAbrirPerfil) {
            onAbrirPerfil();
        }
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <span className="sidebar-logo-title">{titulo}</span>
                <span className="sidebar-logo-sub">{subTitulo}</span>
            </div>

            <div className="sidebar-nav">
                {itens.map((item, index) => (
                    <button
                        key={index}
                        className={`nav-item${item.ativo ? ' active' : ''}`}
                        onClick={item.onClick}
                    >
                        <span>{item.icone}</span>
                        <span>{item.texto}</span>
                    </button>
                ))}
            </div>

            <div className="sidebar-bottom">
                {estaAutenticado && usuarioAtual ? (
                    <div className="sidebar-user-wrapper">
                        <div className="sidebar-user" onClick={() => setMenuUsuarioAberto(!menuUsuarioAberto)}>
                            <div className="sidebar-avatar">
                                {iniciais(usuarioAtual.nomeCompleto!)}
                            </div>
                            
                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{usuarioAtual.nomeCompleto}</div>
                                <div className="sidebar-user-handle">
                                    {usuarioAtual.tipo === 0 ? 'Administrador' : 'Padrão'}
                                </div>
                            </div>
                        </div>

                        {menuUsuarioAberto && (
                            <>
                                <div 
                                    className="menu-backdrop" 
                                    onClick={() => setMenuUsuarioAberto(false)} 
                                />
                                <div className="menu-usuario">
                                    <button
                                        className="menu-item"
                                        onClick={tratarAbrirPerfil}
                                    >
                                        Perfil
                                    </button>
                                    <button
                                        className="menu-item menu-item-sair"
                                        onClick={() => {
                                            setMenuUsuarioAberto(false);
                                            onSair();
                                            navigate('/entrar');
                                        }}
                                    >
                                        Sair
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <button 
                        onClick={() => navigate('/entrar')} 
                        className="sidebar-login-btn"
                    >
                        Entrar
                    </button>
                )}
            </div>
        </nav>
    );
}

export { MenuLateral };
