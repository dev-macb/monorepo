import './feed.style.css';
import { useRef, useState } from 'react';
import { PostCard } from '../post-card/post-card.component';
import { usaDependencias } from '../../di/container';
import { usaFeedViewModel } from './feed.viewmodel';
import { formatarIniciais } from '../../utils/formatador.util';
import type { Usuario } from '../../models';

const LIMITE_CARACTERES = 280;

const TAGS_DISPONIVEIS = [
    'Dev',
    'Design',
    'Backend',
    'Frontend',
    'DevOps',
    'Carreira',
];

interface FeedProps {
    currentUser: Usuario | null;
    estaAutenticado: boolean;
}

function ComposeBox({
    onPublish,
    publishing,
    estaAutenticado,
    currentUser,
}: {
    onPublish: (content: string, tags: string[]) => Promise<void>;
    publishing: boolean;
    estaAutenticado: boolean;
    currentUser: Usuario | null;
}) {
    const [texto, setTexto] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const restante = LIMITE_CARACTERES - texto.length;
    const podePublicar = texto.trim().length > 0 && restante >= 0 && !publishing && estaAutenticado;

    function autoResize() {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    function alternarTag(tag: string) {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    async function manipularPublicacao() {
        if (!podePublicar) return;
        await onPublish(texto.trim(), selectedTags);
        setTexto('');
        setSelectedTags([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }

    const counterClass =
        restante <= 0 ? 'char-counter danger'
            : restante <= 20 ? 'char-counter warning'
                : 'char-counter';

    return (
        <div className="compose-box">
            <div className="compose-avatar">
                {currentUser?.nomeCompleto ? formatarIniciais(currentUser.nomeCompleto) : '?'}
            </div>

            <div className="compose-right">
                <textarea
                    ref={textareaRef}
                    className="compose-textarea"
                    placeholder="Compartilhe algo com a comunidade…"
                    value={texto}
                    rows={2}
                    onChange={(e) => { setTexto(e.target.value); autoResize(); }}
                />

                <div className="compose-tags-row">
                    <span className="compose-tags-label">Tag</span>
                    {TAGS_DISPONIVEIS.map((tag) => (
                        <button
                            key={tag}
                            className={`compose-tag-chip${selectedTags.includes(tag) ? ' selected' : ''}`}
                            onClick={() => alternarTag(tag)}
                            type="button"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="compose-footer">
                    {texto.length > 0 && (
                        <span className={counterClass}>{restante}</span>
                    )}
                    <button
                        className="compose-submit-btn"
                        disabled={!podePublicar}
                        onClick={manipularPublicacao}
                    >
                        {publishing ? 'Publicando…' : 'Publicar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SkeletonFeed() {
    return (
        <>
            {[1, 2, 3, 4].map((i) => (
                <div className="skeleton-post" key={i}>
                    <div className="skeleton-avatar" />
                    <div className="skeleton-content">
                        <div className="skeleton-line" style={{ width: '36%' }} />
                        <div className="skeleton-line" style={{ width: '88%' }} />
                        <div className="skeleton-line" style={{ width: '65%' }} />
                    </div>
                </div>
            ))}
        </>
    );
}

export function Feed({ currentUser, estaAutenticado }: FeedProps) {
    const { postagemRepository } = usaDependencias();
    const {
        posts,
        loading,
        error,
        publishing,
        activeTab,
        publish,
        switchTab,
    } = usaFeedViewModel(postagemRepository, currentUser);

    return (
        <main className="feed-column">
            <header className="feed-header">
                <button
                    className={`feed-tab${activeTab === 'recent' ? ' active' : ''}`}
                    onClick={() => switchTab('recent')}
                >
                    Recentes
                </button>
                <button
                    className={`feed-tab${activeTab === 'popular' ? ' active' : ''}`}
                    onClick={() => switchTab('popular')}
                >
                    Populares
                </button>
            </header>

            <ComposeBox
                onPublish={publish}
                publishing={publishing}
                estaAutenticado={estaAutenticado}
                currentUser={currentUser}
            />

            {loading ? (
                <SkeletonFeed />
            ) : error ? (
                <div className="feed-error">
                    <p>{error}</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>
                        Tentar novamente
                    </button>
                </div>
            ) : posts.length === 0 ? (
                <div className="feed-empty">
                    <p className="feed-empty-title">Ainda vazio por aqui.</p>
                    <p className="feed-empty-sub">
                        Seja o primeiro a publicar algo.
                    </p>
                </div>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </main>
    );
}
