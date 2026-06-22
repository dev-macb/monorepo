import './inicio.style.css';
import { useNavigate } from 'react-router-dom';
import { usaDependencias } from '../../shared/di/container';
import { usaAutenticacao } from '../../shared/contexts/autenticacao.context';
import { usaInicioViewModel } from './inicio.viewmodel';
import { PerfilDialog } from './dialogs/perfil-dialog';
import { TagsPanel } from '../../shared/components/tags-panel/tags-panel.component';
import { Sidebar } from '../../shared/components/sidebar/sidebar.component';
import { Feed } from '../../shared/components/feed/feed.component';

function InicioPage() {
    const navigate = useNavigate();
    const { payload, isAuthenticated, carregando } = usaAutenticacao();
    const { usuarioRepository } = usaDependencias();

    const {
        usuarioAtual,
        carregandoUsuario,
        mostrarPerfil,
        abrirPerfil,
        fecharPerfil,
        atualizarUsuario,
        sair,
    } = usaInicioViewModel(
        usuarioRepository,
        isAuthenticated,
        payload?.idUsuario ?? null,
        () => navigate('/entrar'),
    );

    if (carregando || carregandoUsuario) return null;

    return (
        <div className="inicio-layout">
            <Sidebar
                title="Monorepo"
                subtitle="template"
                items={[
                    { icon: '⌂', label: 'Postagens', active: true },
                    { icon: '⌂', label: 'Etiquetas', active: false, onClick: () => navigate('/etiquetas') },
                ]}
                currentUser={usuarioAtual}
                isAuthenticated={isAuthenticated}
                onLogout={sair}
                onOpenProfile={abrirPerfil}
            />

            <Feed
                currentUser={usuarioAtual}
                estaAutenticado={isAuthenticated}
            />

            <TagsPanel
                tags={[]}
                activeTag={null}
                onSelect={() => { }}
            />

            <PerfilDialog
                usuario={usuarioAtual}
                aberto={mostrarPerfil}
                onClose={fecharPerfil}
                onUpdate={atualizarUsuario}
                onDelete={sair}
            />
        </div>
    );
}

export { InicioPage };
