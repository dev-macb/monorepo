import { useState, useEffect, useCallback } from 'react';
import type { PostagemRepositoryInterface } from '../../interfaces/postagem-repository.interface';
import type { PostagemFeed, Usuario } from '../../models';

export function usaFeedViewModel(
    postRepository: PostagemRepositoryInterface,
    currentUser: Usuario | null,
) {
    const [posts, setPosts] = useState<PostagemFeed[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [publishing, setPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState<'recent' | 'popular'>('recent');
    const [activeTag, setActiveTag] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchPosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await postRepository.obterTodos();
                if (!mounted) return;
                setPosts(data ?? []);
            } catch {
                if (mounted) setError('Não foi possível carregar as postagens.');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchPosts();

        return () => { mounted = false; };
    }, [activeTab, postRepository]);

    const publish = useCallback(async (content: string, tags: string[]) => {
        if (!currentUser) return;

        setPublishing(true);
        try {
            await postRepository.cadastrar(content, tags);
            const data = await postRepository.obterTodos();
            setPosts(data ?? []);
        } catch {
            setError('Erro ao publicar. Tente novamente.');
        } finally {
            setPublishing(false);
        }
    }, [currentUser, postRepository]);

    const switchTab = useCallback((tab: 'recent' | 'popular') => {
        setActiveTab(tab);
    }, []);

    const toggleTag = useCallback((tag: string | null) => {
        setActiveTag((prev) => (prev === tag ? null : tag));
    }, []);

    const filteredPosts = activeTag
        ? posts.filter((p) => p.tags.includes(activeTag))
        : posts;

    const sortedPosts = activeTab === 'popular'
        ? [...filteredPosts].sort((a, b) => b.curtidas - a.curtidas)
        : filteredPosts;

    return {
        posts: sortedPosts,
        loading,
        error,
        publishing,
        activeTab,
        activeTag,
        publish,
        switchTab,
        toggleTag,
    };
}
