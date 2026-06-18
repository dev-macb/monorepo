function formatarData(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function formatarIniciais(name: string): string {
    return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}


export { formatarData, formatarIniciais }