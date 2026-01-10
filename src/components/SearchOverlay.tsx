'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Sparkles, BookOpen, Bookmark, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useBookmarks } from '@/hooks/useBookmarks';
import { askGemini } from '@/actions/gemini';
import { type Scripture } from '@/lib/types';

export default function SearchOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'search' | 'collection'>('search');
    const [query, setQuery] = useState('');
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [results, setResults] = useState<Scripture[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    const { bookmarks, saveBookmark, removeBookmark, isBookmarked } = useBookmarks();

    useEffect(() => {
        setMounted(true);

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = async (term: string) => {
        setQuery(term);
        if (term.length < 3) {
            setResults([]);
            setAiAnswer(null);
            return;
        }

        setIsSearching(true);
        setAiAnswer(null);

        try {
            let searchTerms = term;

            // AI INTERVENTION for questions or complex topics
            if (term.length > 15 || term.includes('?')) {
                const aiResponse = await askGemini(term);

                if (aiResponse && !aiResponse.error) {
                    setAiAnswer(aiResponse.answer);
                    searchTerms = aiResponse.keywords || term;
                }
            }

            const { data } = await supabase
                .from('scriptures')
                .select('*')
                .textSearch('content', searchTerms, {
                    type: 'websearch',
                    config: 'spanish'
                })
                .limit(5);

            if (data) setResults(data as Scripture[]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const navigateToVerse = (book: string, chapter: number, verse: number) => {
        setIsOpen(false);
        router.push(`/?book=${book}&chapter=${chapter}&verse=${verse}`);
    };

    if (!mounted) return null;

    return createPortal(
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-24 right-8 z-[9999] p-4 bg-black/80 backdrop-blur-xl border border-gold/50 rounded-full text-gold hover:scale-110 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] cursor-pointer"
                aria-label="Buscar en la Biblia"
            >
                <Search size={24} className="group-hover:scale-110 transition-transform" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-start justify-center pt-32 px-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: -20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20 }}
                            className="w-full max-w-2xl bg-[#0a0a0a] border border-gold/20 rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.1)] overflow-hidden flex flex-col max-h-[80vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="border-b border-white/5 bg-black/40">
                                <div className="flex items-center gap-4 p-4 pb-0">
                                    <button
                                        onClick={() => setActiveTab('search')}
                                        className={`pb-4 px-2 text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'search' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}
                                    >
                                        Búsqueda Neural
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('collection')}
                                        className={`pb-4 px-2 text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'collection' ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'}`}
                                    >
                                        Mi Colección ({bookmarks.length})
                                    </button>
                                    <div className="flex-1" />
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="mb-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X size={20} className="text-white/40" />
                                    </button>
                                </div>

                                {activeTab === 'search' && (
                                    <div className="p-4 pt-2 flex items-center gap-4">
                                        <Search className={`text-gold ${isSearching ? 'animate-pulse' : ''}`} size={20} />
                                        <input
                                            type="text"
                                            placeholder="Busca sabiduría... (ej. 'luz', 'amor')"
                                            className="w-full bg-transparent text-lg text-white placeholder:text-white/20 outline-none font-serif"
                                            autoFocus
                                            value={query}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-2 min-h-[300px]">
                                {activeTab === 'search' ? (
                                    <>
                                        {aiAnswer && (
                                            <div className="mb-4 p-4 rounded-xl bg-gold/5 border border-gold/20">
                                                <div className="flex items-center gap-2 mb-2 text-gold text-xs uppercase tracking-widest font-bold">
                                                    <Sparkles size={12} />
                                                    <span>Interpretación Divina</span>
                                                </div>
                                                <p className="text-sm text-zinc-300 font-serif italic leading-relaxed">
                                                    &quot;{aiAnswer}&quot;
                                                </p>
                                            </div>
                                        )}

                                        {results.length === 0 && !isSearching && !aiAnswer && query.length > 0 && (
                                            <div className="h-full flex flex-col items-center justify-center py-10 text-white/30 gap-4">
                                                <Sparkles size={32} />
                                                <p>No se encontró esa sabiduría exacta.</p>
                                            </div>
                                        )}
                                        {results.length === 0 && query.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center py-10 text-white/20 gap-4">
                                                <BookOpen size={32} className="opacity-20" />
                                                <p className="text-sm">Escribe para explorar las escrituras.</p>
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            {results.map((verse) => (
                                                <ResultItem
                                                    key={verse.id.toString()}
                                                    verse={verse}
                                                    stored={isBookmarked(verse.id)}
                                                    onToggle={() => isBookmarked(verse.id) ? removeBookmark(verse.id) : saveBookmark(verse)}
                                                    onShare={() => {
                                                        const url = `${window.location.origin}/?book=${encodeURIComponent(verse.book_name)}&chapter=${verse.chapter}&verse=${verse.verse_number}`;
                                                        navigator.clipboard.writeText(url);
                                                        toast.success("Enlace a la app copiado");
                                                    }}
                                                    onNavigate={() => navigateToVerse(verse.book_name, verse.chapter, verse.verse_number)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {bookmarks.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center py-10 text-white/20 gap-4">
                                                <Bookmark size={32} className="opacity-20" />
                                                <p className="text-sm">Tu colección está vacía.</p>
                                                <button onClick={() => setActiveTab('search')} className="text-gold text-xs hover:underline">Ir a buscar</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {bookmarks.map((verse) => (
                                                    <ResultItem
                                                        key={verse.id.toString()}
                                                        verse={verse}
                                                        stored={true}
                                                        onToggle={() => removeBookmark(verse.id)}
                                                        onNavigate={() => navigateToVerse(verse.book_name, verse.chapter, verse.verse_number)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="p-3 bg-black/50 border-t border-white/5 text-[10px] text-white/20 flex justify-between px-6 uppercase tracking-widest">
                                <span>{activeTab === 'search' ? 'Neural Search V1' : 'Local Ark Storage'}</span>
                                <span>ESC para cerrar</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}

function ResultItem({ verse, stored, onToggle, onNavigate, onShare }: { verse: Scripture, stored: boolean, onToggle: () => void, onNavigate: () => void, onShare?: () => void }) {
    return (
        <div className="w-full flex items-start gap-2 p-2 rounded-xl hover:bg-gold/10 hover:border-gold/20 border border-transparent transition-all group">
            <button onClick={onNavigate} className="flex-1 text-left">
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-gold font-serif text-sm uppercase tracking-wider group-hover:text-gold/100 transition-colors">
                        {verse.book_name} {verse.chapter}:{verse.verse_number}
                    </span>
                </div>
                <p className="text-zinc-400 group-hover:text-white transition-colors line-clamp-2 font-serif leading-relaxed">
                    {verse.content}
                </p>
            </button>
            <div className="flex items-center gap-1">
                {onShare && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onShare(); }}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/20 hover:text-gold"
                        title="Compartir Versículo"
                    >
                        <Share2 size={16} />
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onToggle(); }}
                    className={`p-2 rounded-full hover:bg-white/10 transition-colors ${stored ? 'text-gold' : 'text-white/20 hover:text-white'}`}
                >
                    <Bookmark size={18} fill={stored ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    );
}
