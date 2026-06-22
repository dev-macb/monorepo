import './etiquetas.style.css';
import { useNavigate } from 'react-router-dom';
import { usaDependencias } from '../../shared/di/container';
import { usaAutenticacao } from '../../shared/contexts/autenticacao.context';
import { usaEtiquetasViewModel } from './etiquetas.viewmodel';
import { Sidebar } from '../../shared/components/sidebar/sidebar.component';
import { formatarData } from '../../shared/utils/formatador.util';

function SkeletonEtiquetas() {
    return (
        <div className="etiquetas-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="etiquetas-skeleton-item" />
            ))}
        </div>
    );
}

function EtiquetasPage() {
    const navigate = useNavigate();
    const { payload, isAuthenticated } = usaAutenticacao();
    const { etiquetaRepository, usuarioRepository } = usaDependencias();

    const {
        etiquetas,
        carregando,
        erro,
        filtro,
        usuarioAtual,
        definirFiltro,
        tentarNovamente,
        sair,
    } = usaEtiquetasViewModel(
        etiquetaRepository,
        isAuthenticated ? usuarioRepository : null,
        isAuthenticated,
        payload?.idUsuario ?? null,
    );

    return (
        <div className="etiquetas-layout">
            <Sidebar
                title="Monorepo"
                subtitle="template"
                items={[
                    { icon: '⌂', label: 'Postagens', active: false, onClick: () => navigate('/') },
                    { icon: '⌂', label: 'Tags', active: true },
                ]}
                currentUser={usuarioAtual}
                isAuthenticated={isAuthenticated}
                onLogout={sair}
                onOpenProfile={() => {}}
            />

            <main className="etiquetas-column">
                <header className="etiquetas-header">
                    <h1>Etiquetas</h1>
                    <input
                        className="etiquetas-search"
                        placeholder="Filtrar por nome…"
                        value={filtro}
                        onChange={(e) => definirFiltro(e.target.value)}
                    />
                </header>

                {carregando ? (
                    <SkeletonEtiquetas />
                ) : erro ? (
                    <div className="etiquetas-error">
                        <p>{erro}</p>
                        <button className="retry-btn" onClick={tentarNovamente}>
                            Tentar novamente
                        </button>
                    </div>
                ) : etiquetas.length === 0 ? (
                    <div className="etiquetas-empty">
                        <p className="etiquetas-empty-title">
                            {filtro
                                ? `Nenhuma etiqueta corresponde a "${filtro}".`
                                : 'Nenhuma etiqueta encontrada.'}
                        </p>
                        <p className="etiquetas-empty-sub">
                            {filtro
                                ? 'Tente usar um termo diferente.'
                                : 'As etiquetas aparecerão aqui assim que forem criadas.'}
                        </p>
                    </div>
                ) : (
                    etiquetas.map((etiqueta) => (
                        <div key={etiqueta.id} className="etiqueta-card">
                            <span className="etiqueta-card-nome">{etiqueta.nome}</span>
                            <span className="etiqueta-card-data">{formatarData(etiqueta.criadoEm)}</span>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

export { EtiquetasPage };
