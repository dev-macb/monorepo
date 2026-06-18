import './perfil-dialog.style.css';
import { usaDependencias } from '../../../shared/di/container';
import type { Usuario } from '../../../shared/models';
import { usaPerfilDialogViewModel } from './perfil-dialog.viewmodel';

interface PerfilDialogProps {
    usuario: Usuario | null;
    aberto: boolean;
    onClose: () => void;
    onUpdate: (updatedUser: Usuario) => void;
    onDelete: () => void;
}

export function PerfilDialog({ usuario, aberto, onClose, onUpdate, onDelete }: PerfilDialogProps) {
    const { usuarioRepository } = usaDependencias();
    const {
        editando,
        formData,
        loading,
        error,
        alternarEdicao,
        manipularAlterarCampo,
        save,
        cancel,
        excluir,
    } = usaPerfilDialogViewModel(usuarioRepository, usuario, onUpdate, onClose, onDelete);

    if (!aberto || !usuario) return null;

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
                            disabled={loading}
                        >
                            Editar
                        </button>
                        <button
                            className="perfil-icon-btn perfil-icon-btn-remover"
                            onClick={excluir}
                            disabled={loading}
                        >
                            {loading ? 'Excluindo...' : 'Excluir'}
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
                                <span className="perfil-data-valor">{formatDate(usuario.criadoEm)}</span>
                            </div>
                            <div className="perfil-data-item">
                                <span className="perfil-data-label">Última atualização</span>
                                <span className="perfil-data-valor">{formatDate(usuario.atualizadoEm)}</span>
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
