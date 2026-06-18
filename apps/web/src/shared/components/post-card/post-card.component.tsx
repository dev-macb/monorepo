import { useState } from 'react';
import './post-card.style.css';
import { formatarData, formatarIniciais } from '../../utils/formatador.util';
import type { PostagemFeed, Usuario } from '../../models';

function Avatar({ user, size = 36 }: { user: Usuario; size?: number }) {
    return (
        <div className="post-avatar" style={{ width: size, height: size }}>
            {formatarIniciais(user.nomeCompleto)}
        </div>
    );
}

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg
            width="15" height="15"
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

export function PostCard({ post }: { post: PostagemFeed }) {
    const [curtidas, setCurtidas] = useState(post.curtidas);
    const [curtiu, setCurtiu] = useState(post.curtidoPorMim ?? false);

    function alternarCurtida(e: React.MouseEvent) {
        e.stopPropagation();
        setCurtidas((n) => curtiu ? n - 1 : n + 1);
        setCurtiu((v) => !v);
    }

    return (
        <article className="post-card">
            <Avatar user={post.autor} />

            <div className="post-body">
                <div className="post-meta">
                    <span className="post-author-name">{post.autor.nomeCompleto}</span>
                    <span className="post-handle">@{post.autor.tipo}</span>
                    <span className="post-dot">·</span>
                    <span className="post-time">{formatarData(post.criadoEm)}</span>
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
                        className={`post-like-btn${curtiu ? ' active' : ''}`}
                        onClick={alternarCurtida}
                        aria-label="Curtir"
                    >
                            <HeartIcon filled={curtiu} />
                        {curtidas}
                    </button>
                </div>
            </div>
        </article>
    );
}
