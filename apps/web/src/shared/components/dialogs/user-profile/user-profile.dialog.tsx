import './user-profile.style.css';
import { usaDependencias } from '../../../di/container';
import { usaProfileDialogViewModel } from './user-profile.viewmodel';
import type { Usuario } from '../../../models';

interface ProfileDialogProps {
    user: Usuario | null;
    aberto: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: Usuario) => void;
}

export function ProfileDialog({ user, aberto, onClose, onUpdate }: ProfileDialogProps) {
    const { userRepository } = usaDependencias();
    const {
        editando,
        formData,
        loading,
        error,
        alternarEdicao,
        manipularAlterarCampo,
        save,
        cancel,
    } = usaProfileDialogViewModel(userRepository, user, onUpdate, onClose);

    if (!aberto || !user) return null;

    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja remover seu perfil? Esta ação não pode ser desfeita.')) {
            onClose();
        }
    };

    const formatDate = (data?: string) => {
        if (!data) return 'Não informada';
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <div className="perfil-overlay" onClick={cancel}>
            <div className="perfil-modal" onClick={(e) => e.stopPropagation()}>
                <div className="perfil-header">
                    <h2>Perfil</h2>
                    <div className="perfil-header-actions">
                        <button
                            className={`perfil-icon-btn ${editando ? 'perfil-icon-btn-ativo' : ''}`}
                            onClick={alternarEdicao}
                        >
                            Editar
                        </button>
                        <button
                            className="perfil-icon-btn perfil-icon-btn-remover"
                            onClick={handleDelete}
                        >
                            Excluir
                        </button>
                    </div>
                </div>

                <div className="perfil-content">
                    <div className="perfil-avatar-container">
                        <div className="perfil-avatar-grande">
                            {user.nomeCompleto?.[0]?.toUpperCase() || '?'}
                        </div>
                    </div>

                    <div className="perfil-form">
                        <div className="perfil-field">
                            <label>Nome Completo</label>
                            <input
                                type="text"
                                name="nomeCompleto"
                                value={formData.nomeCompleto || ''}
                                onChange={(e) => manipularAlterarCampo(e.target.name, e.target.value)}
                                placeholder="Seu nome completo"
                                disabled={!editando || loading}
                                className={!editando ? 'campo-inativo' : ''}
                            />
                        </div>

                        <div className="perfil-field">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={(e) => manipularAlterarCampo(e.target.name, e.target.value)}
                                placeholder="seu@email.com"
                                disabled={!editando || loading}
                                className={!editando ? 'campo-inativo' : ''}
                            />
                        </div>

                        <div className="perfil-datas">
                            <div className="perfil-data-item">
                                <span className="perfil-data-label">Membro desde</span>
                                <span className="perfil-data-valor">{formatDate(user.criadoEm)}</span>
                            </div>
                            <div className="perfil-data-item">
                                <span className="perfil-data-label">Última atualização</span>
                                <span className="perfil-data-valor">{formatDate(user.atualizadoEm)}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="perfil-erro">{error}</div>
                        )}
                    </div>

                    <div className="perfil-footer">
                        <button
                            className="perfil-btn-salvar"
                            onClick={save}
                            disabled={!editando || loading}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                        <button
                            className="perfil-btn-cancelar"
                            onClick={cancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
