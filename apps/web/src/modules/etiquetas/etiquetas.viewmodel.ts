import { useState, useEffect, useCallback, useRef } from 'react';
import type { EtiquetaRepositoryInterface } from '../../shared/interfaces/etiqueta-repository.interface';
import type { UsuarioRepositoryInterface } from '../../shared/interfaces/usuario-repository.interface';
import type { Etiqueta, Usuario } from '../../shared/models';
import { JwtService } from '../../shared/services/jwt.service';

function usaEtiquetasViewModel(
    etiquetaRepository: EtiquetaRepositoryInterface,
    usuarioRepository: UsuarioRepositoryInterface | null,
    estaAutenticado: boolean,
    idUsuario: number | null,
) {
    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
    const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [filtro, setFiltro] = useState('');

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    useEffect(() => {
        if (estaAutenticado && idUsuario !== null && usuarioRepository) {
            usuarioRepository.obterPorId(idUsuario).then((u) => {
                if (mounted.current) setUsuarioAtual(u);
            }).catch(() => {});
        } else {
            setUsuarioAtual(null);
        }
    }, [estaAutenticado, idUsuario, usuarioRepository]);

    const carregarEtiquetas = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const dados = await etiquetaRepository.obterTodos();
            if (!mounted.current) return;
            setEtiquetas(dados ?? []);
        } catch {
            if (mounted.current) setErro('Não foi possível carregar as etiquetas.');
        } finally {
            if (mounted.current) setCarregando(false);
        }
    }, [etiquetaRepository]);

    useEffect(() => {
        carregarEtiquetas();
    }, [carregarEtiquetas]);

    const tentarNovamente = useCallback(() => {
        carregarEtiquetas();
    }, [carregarEtiquetas]);

    const definirFiltro = useCallback((valor: string) => {
        setFiltro(valor);
    }, []);

    const etiquetasFiltradas = etiquetas.filter((e) =>
        e.nome.toLowerCase().includes(filtro.toLowerCase()),
    );

    const sair = useCallback(() => {
        setUsuarioAtual(null);
        JwtService.removerToken();
    }, []);

    return {
        etiquetas: etiquetasFiltradas,
        carregando,
        erro,
        filtro,
        usuarioAtual,
        definirFiltro,
        tentarNovamente,
        sair,
    };
}

export { usaEtiquetasViewModel };
