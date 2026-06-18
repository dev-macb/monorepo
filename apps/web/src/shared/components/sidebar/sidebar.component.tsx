import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.style.css';
import { formatarIniciais } from '../../utils/formatador.util';
import type { Usuario } from '../../models';

interface MenuItem {
    icon: string;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

interface SidebarProps {
    title: string;
    subtitle: string;
    items: MenuItem[];
    currentUser?: Usuario | null;
    isAuthenticated: boolean;
    onLogout: () => void;
    onOpenProfile?: () => void;
}

export function Sidebar({ title, subtitle, items, currentUser, isAuthenticated, onLogout, onOpenProfile }: SidebarProps) {
    const [menuAberto, setMenuAberto] = useState(false);
    const navigate = useNavigate();

    const manipularAbrirPerfil = () => {
        setMenuAberto(false);
        if (onOpenProfile) {
            onOpenProfile();
        }
    };

    return (
        <nav className="sidebar">
            <div className="sidebar-logo">
                <span className="sidebar-logo-title">{title}</span>
                <span className="sidebar-logo-sub">{subtitle}</span>
            </div>

            <div className="sidebar-nav">
                {items.map((item, index) => (
                    <button
                        key={index}
                        className={`nav-item${item.active ? ' active' : ''}`}
                        onClick={item.onClick}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            <div className="sidebar-bottom">
                {isAuthenticated && currentUser ? (
                    <div className="sidebar-user-wrapper">
                        <div className="sidebar-user" onClick={() => setMenuAberto(!menuAberto)}>
                            <div className="sidebar-avatar">
                                {formatarIniciais(currentUser.nomeCompleto!)}
                            </div>

                            <div className="sidebar-user-info">
                                <div className="sidebar-user-name">{currentUser.nomeCompleto}</div>
                                <div className="sidebar-user-handle">
                                    {currentUser.tipo === 0 ? 'Administrador' : 'Padrão'}
                                </div>
                            </div>
                        </div>

                        {menuAberto && (
                            <>
                                <div
                                    className="menu-backdrop"
                                    onClick={() => setMenuAberto(false)}
                                />
                                <div className="menu-usuario">
                                    <button
                                        className="menu-item"
                                        onClick={manipularAbrirPerfil}
                                    >
                                        Perfil
                                    </button>
                                    <button
                                        className="menu-item menu-item-sair"
                                        onClick={() => {
                                            setMenuAberto(false);
                                            onLogout();
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
