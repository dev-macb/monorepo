import './inicio.style.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../shared/services/api.service';
import { usaTokenUsuario } from '../../shared/contexts/usuario.context';
import { PerfilDialog } from '../../shared/dialogs/usuario-perfil.dialog';
import { PainelTags } from '../../shared/components/painel-tags/painel-tags.component';
import { MenuLateral } from '../../shared/components/menu-lateral/menu-lateral.component';
import { FeedPostagens } from '../../shared/components/feed-postagens/feed-postagens.component';

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

function InicioPage() {
    const navigate = useNavigate();
    const { usuario, estaAutenticado, carregando: carregandoAutenticacao, sair } = usaTokenUsuario();

    const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
    const [mostrarPerfil, setMostrarPerfil] = useState(false);

    useEffect(() => {
        const tratarMundancaDeHash = () => {
            setMostrarPerfil(window.location.hash === '#perfil-usuario');
        };

        tratarMundancaDeHash();

        window.addEventListener('hashchange', tratarMundancaDeHash);
        
        return () => {
            window.removeEventListener('hashchange', tratarMundancaDeHash);
        };
    }, []);

    useEffect(() => {
        const buscarUsuarioAutenticado = async () => {
            if (estaAutenticado && usuario) {
                try {
                    const usuarioAutenticado = await api.get<Usuario>(`usuarios/${usuario.idUsuario}`);
                    if (!usuarioAutenticado) return;

                    setUsuarioAtual(usuarioAutenticado);
                }
                catch (erro) {
                    sair();
                    navigate('/entrar');
                }
            } else {
                setUsuarioAtual(null);
            }
        };

        if (!carregandoAutenticacao) {
            buscarUsuarioAutenticado();
        }
    }, [estaAutenticado, usuario, carregandoAutenticacao]);

    const tratarAbrirPerfil = () => {
        window.location.hash = 'perfil-usuario';
    };

    const tratarFecharPerfil = () => {
        setMostrarPerfil(false);
        window.history.pushState('', document.title, window.location.pathname + window.location.search);
    };

    const tratarAtualizarUsuario = (usuarioAtualizado: Usuario) => {
        setUsuarioAtual(usuarioAtualizado);
        tratarFecharPerfil();
    };

    return (
        <div className="inicio-layout">
            <MenuLateral
                titulo="Monorepo"
                subTitulo="template"
                itens={[
                    { icone: '⌂', texto: 'Postagens', ativo: true },
                    { icone: '⌂', texto: 'Tags', ativo: false },
                ]}
                usuarioAtual={usuarioAtual}
                estaAutenticado={estaAutenticado}
                onSair={sair}
                onAbrirPerfil={tratarAbrirPerfil}
            />

            <FeedPostagens
                usuarioAtual={usuarioAtual}
                usuarioLogado={estaAutenticado && !!usuario}
            />

            <PainelTags
                tags={[]}
                tagAtiva={null}
                onSelecionar={() => {}}
            />

            <PerfilDialog
                usuario={usuarioAtual}
                isOpen={mostrarPerfil}
                onClose={tratarFecharPerfil}
                onUpdate={tratarAtualizarUsuario}
            />
        </div>
    );
}

export { InicioPage };