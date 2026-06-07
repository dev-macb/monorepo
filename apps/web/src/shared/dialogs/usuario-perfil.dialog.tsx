import { useState, useEffect } from 'react';
import { api } from '../services/api.service';
import './usuario-perfil.style.css';

interface Usuario {
    id?: string;
    tipo?: number;
    nomeCompleto?: string;
    email?: string;
    senha?: string;
    ativo?: boolean;
    criadoEm?: string;
    atualizadoEm?: string;
}

interface PerfilDialogProps {
    usuario: Usuario | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (usuarioAtualizado: Usuario) => void;
}

function PerfilDialog({ usuario, isOpen, onClose, onUpdate }: PerfilDialogProps) {
    const [modoEdicao, setModoEdicao] = useState(false);
    const [formData, setFormData] = useState<Partial<Usuario>>({});
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    useEffect(() => {
        if (usuario) {
            setFormData({
                nomeCompleto: usuario.nomeCompleto || '',
                email: usuario.email || '',
            });
        }
    }, [usuario]);

    if (!isOpen || !usuario) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErro(null);
    };

    const handleEditar = () => {
        setModoEdicao(!modoEdicao);
        setErro(null);
    };

    const handleCancelar = () => {
        onClose(); // <-- CORREÇÃO: fecha o diálogo
    };

    const handleSalvar = async () => {
        if (!formData.nomeCompleto?.trim()) {
            setErro('Nome completo é obrigatório');
            return;
        }

        if (!formData.email?.trim()) {
            setErro('Email é obrigatório');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErro('Email inválido');
            return;
        }

        setCarregando(true);
        setErro(null);

        try {
            const usuarioAtualizado = await api.patch<Usuario>(`usuarios/${usuario.id}`, {
                nomeCompleto: formData.nomeCompleto.trim(),
                email: formData.email.trim(),
            });

            setModoEdicao(false);
            onUpdate(usuarioAtualizado);
            onClose();
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            setErro('Erro ao atualizar dados. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    const handleRemover = () => {
        if (window.confirm('Tem certeza que deseja remover seu perfil? Esta ação não pode ser desfeita.')) {
            console.log('Remover perfil:', usuario.id);
            onClose();
        }
    };

    const formatarData = (data?: string) => {
        if (!data) return 'Não informada';
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="perfil-overlay" onClick={onClose}>
            <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
                <div className="perfil-header">
                    <h2>Perfil</h2>
                    <div className="perfil-header-actions">
                        <button 
                            className={`perfil-icon-btn ${modoEdicao ? 'perfil-icon-btn-ativo' : ''}`}
                            onClick={handleEditar}
                        >
                            Editar
                        </button>
                        <button 
                            className="perfil-icon-btn perfil-icon-btn-remover" 
                            onClick={handleRemover}
                        >
                            Excluir
                        </button>
                    </div>
                </div>

                <div className="perfil-content">
                    <div className="perfil-avatar-container">
                        <div className="perfil-avatar-grande">
                            {usuario.nomeCompleto?.[0]?.toUpperCase() || '?'}
                        </div>
                    </div>

                    <div className="perfil-form">
                        <div className="perfil-field">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                name="nomeCompleto"
                                value={formData.nomeCompleto || ''}
                                onChange={handleInputChange}
                                placeholder="Seu nome completo"
                                disabled={!modoEdicao || carregando}
                                className={!modoEdicao ? 'campo-inativo' : ''}
                            />
                        </div>

                        <div className="perfil-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                placeholder="seu@email.com"
                                disabled={!modoEdicao || carregando}
                                className={!modoEdicao ? 'campo-inativo' : ''}
                            />
                        </div>

                        <div className="perfil-datas">
                            <div className="perfil-data-item">
                                <span className="perfil-data-label">Membro desde</span>
                                <span className="perfil-data-valor">{formatarData(usuario.criadoEm)}</span>
                            </div>
                            <div className="perfil-data-item">
                                <span className="perfil-data-label">Última atualização</span>
                                <span className="perfil-data-valor">{formatarData(usuario.atualizadoEm)}</span>
                            </div>
                        </div>

                        {erro && (
                            <div className="perfil-erro">{erro}</div>
                        )}
                    </div>

                    <div className="perfil-footer">
                        <button
                            className="perfil-btn-salvar"
                            onClick={handleSalvar}
                            disabled={!modoEdicao || carregando}
                        >
                            {carregando ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            className="perfil-btn-cancelar"
                            onClick={handleCancelar}
                            disabled={carregando}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { PerfilDialog };