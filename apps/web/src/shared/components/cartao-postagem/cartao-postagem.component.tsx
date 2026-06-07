import { useState } from 'react';
import './cartao-postagem.style.css';
import { formatarTempo, iniciais } from '../../utils/formatador.util';

interface Tag {
    nome: string;
    total: number;
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

function Avatar({ usuario, tamanho = 36 }: { usuario: Usuario; tamanho?: number }) {
    return (
        <div className="post-avatar" style={{ width: tamanho, height: tamanho }}>
            {iniciais(usuario.nomeCompleto!)}
        </div>
    );
}

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

export function CartaoPostagem({ post }: { post: Post }) {
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
                    <span className="post-author-name">{post.autor.nomeCompleto}</span>
                    <span className="post-handle">@{post.autor.tipo}</span>
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