import './painel-tags.style.css';

interface Tag {
    nome: string;
    total: number;
}

interface PainelTagsProps {
    tags: Tag[];
    tagAtiva: string | null;
    onSelecionar: (tag: string | null) => void;
}

export function PainelTags({ tags, tagAtiva, onSelecionar }: PainelTagsProps) {
    return (
        <aside className="right-panel">
            <div className="panel-section-label">Tags</div>
            <div className="tag-list">
                <div
                    className={`tag-list-item${tagAtiva === null ? ' active' : ''}`}
                    onClick={() => onSelecionar(null)}
                >
                    <span className="tag-list-item-name">Todas</span>
                    <span className="tag-list-item-count">
                        {tags.reduce((a, t) => a + t.total, 0)}
                    </span>
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