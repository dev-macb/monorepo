import './tags-panel.style.css';

interface Tag {
    name: string;
    count: number;
}

interface TagsPanelProps {
    tags: Tag[];
    activeTag: string | null;
    onSelect: (tag: string | null) => void;
}

export function TagsPanel({ tags, activeTag, onSelect }: TagsPanelProps) {
    return (
        <aside className="right-panel">
            <div className="panel-section-label">Tags</div>
            <div className="tag-list">
                <div
                    className={`tag-list-item${activeTag === null ? ' active' : ''}`}
                    onClick={() => onSelect(null)}
                >
                    <span className="tag-list-item-name">Todas</span>
                    <span className="tag-list-item-count">
                        {tags.reduce((a, t) => a + t.count, 0)}
                    </span>
                </div>
                {tags.map((t) => (
                    <div
                        key={t.name}
                        className={`tag-list-item${activeTag === t.name ? ' active' : ''}`}
                        onClick={() => onSelect(activeTag === t.name ? null : t.name)}
                    >
                        <span className="tag-list-item-name">{t.name}</span>
                        <span className="tag-list-item-count">{t.count}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
