import { useState, useEffect, useCallback } from 'react';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usuario-repository.interface';
import type { Usuario } from '../../shared/models';
import { JwtService } from '../../shared/services/jwt.service';

function usaInicioViewModel(
    usuarioRepository: UsuarioRepositoryInterface,
    estaAutenticado: boolean,
    idUsuario: number | null,
    aoRedirecionarEntrar: () => void,
) {
    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
    const [carregandoUsuario, setCarregandoUsuario] = useState(true);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    useEffect(() => {
        let mounted = true;

        const buscarUsuario = async () => {
            if (estaAutenticado && idUsuario !== null) {
                try {
                    const usuario = await usuarioRepository.obterPorId(idUsuario);
                    if (!mounted) return;
                    setUsuarioAtual(usuario);
                } catch {
                    if (!mounted) return;
                    setCarregandoUsuario(false);
                    return;
                }
            } else {
                setUsuarioAtual(null);
            }
            if (mounted) setCarregandoUsuario(false);
        };
        buscarUsuario();

        return () => { mounted = false; };
    }, [estaAutenticado, idUsuario]);

    const abrirPerfil = useCallback(() => {
        setMostrarPerfil(true);
    }, []);

    const fecharPerfil = useCallback(() => {
        setMostrarPerfil(false);
    }, []);

    const atualizarUsuario = useCallback((usuarioAtualizado: Usuario) => {
        setUsuarioAtual(usuarioAtualizado);
        fecharPerfil();
    }, [fecharPerfil]);

    const sair = useCallback(() => {
        setUsuarioAtual(null);
        JwtService.removerToken();
        aoRedirecionarEntrar();
    }, [aoRedirecionarEntrar]);

    return {
        usuarioAtual,
        carregandoUsuario,
        mostrarPerfil,
        abrirPerfil,
        fecharPerfil,
        atualizarUsuario,
        sair,
    };
}

export { usaInicioViewModel };
