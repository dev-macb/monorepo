// inicio.page.tsx
import { useState, useEffect, useRef } from 'react';
import './inicio.style.css';

// ── Types ────────────────────────────────────────────────────
interface Usuario {
    id: string;
    nome: string;
    handle: string;
    avatarUrl?: string;
}

interface Post {
    id: string;
    conteudo: string;
    tags: string[];
    criadoEm: string;
    autor: Usuario;
    curtidas: number;
    curtidoPorMim?: boolean;
}

// ── Constantes ───────────────────────────────────────────────
const LIMITE_CARACTERES = 280;

const TAGS_DISPONIVEIS = [
    'Dev',
    'Design',
    'Backend',
    'Frontend',
    'DevOps',
    'Carreira',
];

// ── Mock data ────────────────────────────────────────────────
const POSTS_MOCK: Post[] = [
    {
        id: '1',
        conteudo: 'Estrutura de monorepo com workspaces do pnpm ficou impecável. Front e back compartilhando types sem nenhum workaround.',
        tags: ['Dev', 'Backend'],
        criadoEm: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
        autor: { id: 'u1', nome: 'Ana Ferreira', handle: 'anaferreira' },
        curtidas: 34,
        curtidoPorMim: false,
    },
    {
        id: '2',
        conteudo: 'TypeScript strict mode ativado desde o dia zero. Já salvou de três bugs que nem eu sabia que existiam.',
        tags: ['Dev'],
        criadoEm: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        autor: { id: 'u2', nome: 'Carlos Mendes', handle: 'carlosm' },
        curtidas: 87,
        curtidoPorMim: true,
    },
    {
        id: '3',
        conteudo: 'Implementando autenticação JWT com refresh token no NestJS. A parte chave é o guard de refresh ser separado do guard de acesso — evita loop de renovação.',
        tags: ['Backend', 'Dev'],
        criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        autor: { id: 'u3', nome: 'Beatriz Lima', handle: 'beatrizdev' },
        curtidas: 61,
        curtidoPorMim: false,
    },
    {
        id: '4',
        conteudo: 'CSS puro ainda é subestimado. Sem Tailwind, sem CSS-in-JS, só variáveis e cascade. O resultado é mais limpo do que parece.',
        tags: ['Frontend', 'Design'],
        criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        autor: { id: 'u4', nome: 'Diego Souza', handle: 'diegosouza' },
        curtidas: 119,
        curtidoPorMim: false,
    },
    {
        id: '5',
        conteudo: 'Docker Compose com hot reload para o NestJS e Vite no front. Ambiente local que respeita o ambiente de produção desde o início.',
        tags: ['DevOps', 'Backend'],
        criadoEm: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        autor: { id: 'u5', nome: 'Fernanda Costa', handle: 'fercosta' },
        curtidas: 52,
        curtidoPorMim: false,
    },
];

// ── Usuário mock para demonstração ───────────────────────────
const USUARIO_MOCK: Usuario = {
    id: 'usuario_atual',
    nome: 'Usuário Demo',
    handle: 'demouser',
};

// ── Utils ─────────────────────────────────────────────────────
function formatarTempo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function iniciais(nome: string): string {
    return nome.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}

// ── Avatar ────────────────────────────────────────────────────
function Avatar({ usuario, tamanho = 36 }: { usuario: Usuario; tamanho?: number }) {
    return (
        <div className="post-avatar" style={{ width: tamanho, height: tamanho }}>
            {usuario.avatarUrl
                ? <img src={usuario.avatarUrl} alt={usuario.nome} />
                : iniciais(usuario.nome)
            }
        </div>
    );
}

// ── Ícone Coração ─────────────────────────────────────────────
function IconCoracao({ preenchido }: { preenchido: boolean }) {
    return (
        <svg
            width="15" height="15"
            viewBox="0 0 24 24"
            fill={preenchido ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
    const [curtidas, setCurtidas] = useState(post.curtidas);
    const [curtido, setCurtido] = useState(post.curtidoPorMim ?? false);

    function toggleCurtida(e: React.MouseEvent) {
        e.stopPropagation();
        setCurtidas((n) => curtido ? n - 1 : n + 1);
        setCurtido((v) => !v);
    }

    return (
        <article className="post-card">
            <Avatar usuario={post.autor} />

            <div className="post-body">
                <div className="post-meta">
                    <span className="post-author-name">{post.autor.nome}</span>
                    <span className="post-handle">@{post.autor.handle}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time">{formatarTempo(post.criadoEm)}</span>
                </div>

                <p className="post-content">{post.conteudo}</p>

                {post.tags.length > 0 && (
                    <div className="post-tags">
                        {post.tags.map((tag) => (
                            <span key={tag} className="post-tag">{tag}</span>
                        ))}
                    </div>
                )}

                <div className="post-actions">
                    <button
                        className={`post-like-btn${curtido ? ' active' : ''}`}
                        onClick={toggleCurtida}
                        aria-label="Curtir"
                    >
                        <IconCoracao preenchido={curtido} />
                        {curtidas}
                    </button>
                </div>
            </div>
        </article>
    );
}

// ── Compose Box ───────────────────────────────────────────────
function ComposeBox({
    onPublicar,
    publicando,
}: {
    onPublicar: (conteudo: string, tags: string[]) => Promise<void>;
    publicando: boolean;
}) {
    const [texto, setTexto] = useState('');
    const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const restantes = LIMITE_CARACTERES - texto.length;
    const podePublicar = texto.trim().length > 0 && restantes >= 0 && !publicando;

    function autoResize() {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    }

    function toggleTag(tag: string) {
        setTagsSelecionadas((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }

    async function handlePublicar() {
        if (!podePublicar) return;
        await onPublicar(texto.trim(), tagsSelecionadas);
        setTexto('');
        setTagsSelecionadas([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }

    const classeContador =
        restantes <= 0 ? 'char-counter danger'
        : restantes <= 20 ? 'char-counter warning'
        : 'char-counter';

    return (
        <div className="compose-box">
            <div className="compose-avatar">
                {iniciais(USUARIO_MOCK.nome)}
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
                            className={`compose-tag-chip${tagsSelecionadas.includes(tag) ? ' selected' : ''}`}
                            onClick={() => toggleTag(tag)}
                            type="button"
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="compose-footer">
                    {texto.length > 0 && (
                        <span className={classeContador}>{restantes}</span>
                    )}
                    <button
                        className="compose-submit-btn"
                        disabled={!podePublicar}
                        onClick={handlePublicar}
                    >
                        {publicando ? 'Publicando…' : 'Publicar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Skeleton ──────────────────────────────────────────────────
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

// ── Painel de Tags (sidebar right) ────────────────────────────
function PainelTags({
    tags,
    tagAtiva,
    onSelecionar,
}: {
    tags: { nome: string; total: number }[];
    tagAtiva: string | null;
    onSelecionar: (tag: string | null) => void;
}) {
    return (
        <aside className="right-panel">
            <div className="panel-section-label">Tags</div>
            <div className="tag-list">
                <div
                    className={`tag-list-item${tagAtiva === null ? ' active' : ''}`}
                    onClick={() => onSelecionar(null)}
                >
                    <span className="tag-list-item-name">Todas</span>
                    <span className="tag-list-item-count">{tags.reduce((a, t) => a + t.total, 0)}</span>
                </div>
                {tags.map((t) => (
                    <div
                        key={t.nome}
                        className={`tag-list-item${tagAtiva === t.nome ? ' active' : ''}`}
                        onClick={() => onSelecionar(tagAtiva === t.nome ? null : t.nome)}
                    >
                        <span className="tag-list-item-name">{t.nome}</span>
                        <span className="tag-list-item-count">{t.total}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}

// ── Modal Publicar (mobile) ───────────────────────────────────
function ModalPublicar({
    aberto,
    onFechar,
    onPublicar,
    publicando,
}: {
    aberto: boolean;
    onFechar: () => void;
    onPublicar: (conteudo: string, tags: string[]) => Promise<void>;
    publicando: boolean;
}) {
    if (!aberto) return null;
    return (
        <div className="modal-overlay" onClick={onFechar}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-close">
                    <button className="modal-close-btn" onClick={onFechar}>Fechar</button>
                </div>
                <ComposeBox
                    onPublicar={async (c, t) => { await onPublicar(c, t); onFechar(); }}
                    publicando={publicando}
                />
            </div>
        </div>
    );
}

// ── Página Principal (Feed) ───────────────────────────────────
export function InicioPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [publicando, setPublicando] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<'recentes' | 'populares'>('recentes');
    const [tagAtiva, setTagAtiva] = useState<string | null>(null);
    const [modalAberto, setModalAberto] = useState(false);

    useEffect(() => {
        const buscar = async () => {
            setCarregando(true);
            setErro(null);
            try {
                const resp = await fetch('http://localhost:3000/posts');
                if (!resp.ok) throw new Error();
                const resultado = await resp.json();
                setPosts(resultado.dados ?? resultado);
            } catch {
                setPosts(POSTS_MOCK);
            } finally {
                setCarregando(false);
            }
        };
        void buscar();
    }, [abaAtiva]);

    async function handlePublicar(conteudo: string, tags: string[]) {
        setPublicando(true);
        try {
            const novoPost: Post = {
                id: String(Date.now()),
                conteudo,
                tags,
                criadoEm: new Date().toISOString(),
                autor: USUARIO_MOCK,
                curtidas: 0,
                curtidoPorMim: false,
            };
            setPosts((prev) => [novoPost, ...prev]);
        } finally {
            setPublicando(false);
        }
    }

    const estatisticasTags = TAGS_DISPONIVEIS.map((nome) => ({
        nome,
        total: posts.filter((p) => p.tags.includes(nome)).length,
    })).filter((t) => t.total > 0);

    const postsFiltrados = tagAtiva
        ? posts.filter((p) => p.tags.includes(tagAtiva))
        : posts;

    const postsOrdenados =
        abaAtiva === 'populares'
            ? [...postsFiltrados].sort((a, b) => b.curtidas - a.curtidas)
            : postsFiltrados;

    return (
        <div className="inicio-layout">
            {/* ── Sidebar ── */}
            <nav className="sidebar">
                <div className="sidebar-logo">
                    <span className="sidebar-logo-title">Mono Repo</span>
                    <span className="sidebar-logo-sub">comunidade dev</span>
                </div>

                <div className="sidebar-nav">
                    <button className="nav-item active">
                        <span>⌂</span>
                        <span>Início</span>
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <div className="sidebar-user">
                        <div className="sidebar-avatar">
                            {iniciais(USUARIO_MOCK.nome)}
                        </div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{USUARIO_MOCK.nome}</div>
                            <div className="sidebar-user-handle">@{USUARIO_MOCK.handle}</div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ── Feed ── */}
            <main className="feed-column">
                <header className="feed-header">
                    <button
                        className={`feed-tab${abaAtiva === 'recentes' ? ' active' : ''}`}
                        onClick={() => setAbaAtiva('recentes')}
                    >
                        Recentes
                    </button>
                    <button
                        className={`feed-tab${abaAtiva === 'populares' ? ' active' : ''}`}
                        onClick={() => setAbaAtiva('populares')}
                    >
                        Populares
                    </button>
                </header>

                <ComposeBox onPublicar={handlePublicar} publicando={publicando} />

                {carregando ? (
                    <SkeletonFeed />
                ) : erro ? (
                    <div className="feed-error">
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'var(--ink-dim)' }}>
                            Não foi possível carregar os posts.
                        </p>
                        <button className="retry-btn" onClick={() => window.location.reload()}>
                            Tentar novamente
                        </button>
                    </div>
                ) : postsOrdenados.length === 0 ? (
                    <div className="feed-empty">
                        <p className="feed-empty-title">Ainda vazio por aqui.</p>
                        <p className="feed-empty-sub">
                            Seja o primeiro a publicar algo.
                        </p>
                    </div>
                ) : (
                    postsOrdenados.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </main>

            {/* ── Painel Tags ── */}
            <PainelTags
                tags={estatisticasTags}
                tagAtiva={tagAtiva}
                onSelecionar={setTagAtiva}
            />

            {/* ── Modal mobile ── */}
            <ModalPublicar
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onPublicar={handlePublicar}
                publicando={publicando}
            />
        </div>
    );
}