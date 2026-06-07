import { useState, useEffect, useRef } from 'react';
import { CartaoPostagem } from '../cartao-postagem/cartao-postagem.component';
import { api } from '../../services/api.service';
import { iniciais } from '../../utils/formatador.util';
import './feed-postagens.style.css';

const LIMITE_CARACTERES = 280;

const TAGS_DISPONIVEIS = [
    'Dev',
    'Design',
    'Backend',
    'Frontend',
    'DevOps',
    'Carreira',
];

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

interface Post {
    id: string;
    conteudo: string;
    tags: string[];
    criadoEm: string;
    autor: Usuario;
    curtidas: number;
    curtidoPorMim?: boolean;
}

interface FeedPostagensProps {
    usuarioAtual: Usuario | null;
    usuarioLogado: boolean;
}

function ComposeBox({
    onPublicar,
    publicando,
    usuarioLogado,
    usuarioAtual,
}: {
    onPublicar: (conteudo: string, tags: string[]) => Promise<void>;
    publicando: boolean;
    usuarioLogado: boolean;
    usuarioAtual: Usuario | null;
}) {
    const [texto, setTexto] = useState('');
    const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const restantes = LIMITE_CARACTERES - texto.length;
    const podePublicar = texto.trim().length > 0 && restantes >= 0 && !publicando && usuarioLogado;

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
                {usuarioAtual?.nomeCompleto ? iniciais(usuarioAtual.nomeCompleto) : '?'}
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

export function FeedPostagens({ usuarioAtual, usuarioLogado }: FeedPostagensProps) {
    const [postagens, setPostagens] = useState<Post[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [publicando, setPublicando] = useState(false);
    const [abaAtiva, setAbaAtiva] = useState<'recentes' | 'populares'>('recentes');
    const [tagAtiva, setTagAtiva] = useState<string | null>(null);

    useEffect(() => {
        const buscarPostagens = async () => {
            setCarregando(true);
            setErro(null);

            try {
                const dados = await api.get<Post[]>('postagens');
                if (!dados) return;
                setPostagens(dados);
            } catch {
                setErro('Não foi possível carregar as postagens.');
            } finally {
                setCarregando(false);
            }
        };

        void buscarPostagens();
    }, [abaAtiva]);

    async function handlePublicar(conteudo: string, tags: string[]) {
        if (!usuarioAtual) return;

        setPublicando(true);
        try {
            const novoPost: Post = {
                id: String(Date.now()),
                conteudo,
                tags,
                criadoEm: new Date().toISOString(),
                autor: usuarioAtual,
                curtidas: 0,
                curtidoPorMim: false,
            };
            setPostagens((prev) => [novoPost, ...prev]);
        } finally {
            setPublicando(false);
        }
    }

    const postsFiltrados = tagAtiva
        ? postagens.filter((p) => p.tags.includes(tagAtiva))
        : postagens;

    const postsOrdenados = abaAtiva === 'populares'
        ? [...postsFiltrados].sort((a, b) => b.curtidas - a.curtidas)
        : postsFiltrados;

    return (
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

            <ComposeBox
                onPublicar={handlePublicar}
                publicando={publicando}
                usuarioLogado={usuarioLogado}
                usuarioAtual={usuarioAtual}
            />

            {carregando ? (
                <SkeletonFeed />
            ) : erro ? (
                <div className="feed-error">
                    <p>{erro}</p>
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
                postsOrdenados.map((postagem) => (
                    <CartaoPostagem key={postagem.id} post={postagem} />
                ))
            )}
        </main>
    );
}