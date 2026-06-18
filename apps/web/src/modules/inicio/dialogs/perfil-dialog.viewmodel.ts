import { useState, useEffect, useCallback } from 'react';
import type { UsuarioRepositoryInterface } from '../../../shared/interfaces/usuario-repository.interface';
import type { Usuario } from '../../../shared/models';

export function usaPerfilDialogViewModel(
    usuarioRepository: UsuarioRepositoryInterface,
    user: Usuario | null,
    onUpdate: (user: Usuario) => void,
    onClose: () => void,
    onDelete: () => void,
) {
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState<Partial<Usuario>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nomeCompleto: user.nomeCompleto || '',
                email: user.email || '',
            });
        }
    }, [user]);

    const alternarEdicao = useCallback(() => {
        setEditando((prev) => !prev);
        setError(null);
    }, []);

    const manipularAlterarCampo = useCallback((name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
    }, []);

    const cancel = useCallback(() => {
        onClose();
    }, [onClose]);

    const save = useCallback(async () => {
        if (!formData.nomeCompleto?.trim()) {
            setError('Nome completo é obrigatório');
            return;
        }
        if (!formData.email?.trim()) {
            setError('Email é obrigatório');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Email inválido');
            return;
        }
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const updatedUser = await usuarioRepository.atualizar(user.id, {
                nomeCompleto: formData.nomeCompleto.trim(),
                email: formData.email.trim(),
            });
            setEditando(false);
            onUpdate(updatedUser);
            onClose();
        } catch {
            setError('Erro ao atualizar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [formData, user, usuarioRepository, onUpdate, onClose]);

    const excluir = useCallback(async () => {
        if (!user) return;
        if (!window.confirm('Tem certeza que deseja desativar seu perfil? Você não poderá mais fazer login.')) return;

        setLoading(true);
        setError(null);

        try {
            await usuarioRepository.desativar(user.id);
            onClose();
            onDelete();
        } catch {
            setError('Erro ao desativar conta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [user, usuarioRepository, onClose, onDelete]);

    return {
        editando,
        formData,
        loading,
        error,
        alternarEdicao,
        manipularAlterarCampo,
        save,
        cancel,
        excluir,
    };
}
