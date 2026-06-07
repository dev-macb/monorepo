export function formatarTempo(iso: string): string {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export function iniciais(nome: string): string {
    return nome.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase();
}