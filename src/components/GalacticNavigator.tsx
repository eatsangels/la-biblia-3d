'use client';

import { useState, useEffect } from 'react';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { BIBLE_BOOKS } from '@/lib/bibleData';
import { getVerseCount } from '@/actions/scriptures';

export const GalacticNavigator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'books' | 'chapters' | 'verses'>('books');
    const [selectedBook, setSelectedBook] = useState<typeof BIBLE_BOOKS[0] | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
    const [versesCount, setVersesCount] = useState<number>(0);
    const [isLoadingVerses, setIsLoadingVerses] = useState(false);
    const [filter, setFilter] = useState('');
    const router = useRouter();

    // Keyboard Shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                if (step === 'verses') setStep('chapters');
                else if (step === 'chapters') setStep('books');
                else setIsOpen(false);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [step]);

    // Reset state when closing
    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('books');
                setSelectedBook(null);
                setSelectedChapter(null);
                setVersesCount(0);
                setFilter('');
            }, 200);
        }
    }, [isOpen]);

    const handleBookSelect = (book: typeof BIBLE_BOOKS[0]) => {
        setSelectedBook(book);
        setStep('chapters');
        setFilter('');
    };

    const handleChapterSelect = async (chapter: number) => {
        if (!selectedBook) return;
        setSelectedChapter(chapter);
        setIsLoadingVerses(true);
        setStep('verses');

        // Fetch real verse count
        const count = await getVerseCount(selectedBook.name, chapter);
        setVersesCount(count > 0 ? count : 50); // Fallback to 50 if zero (shouldn't happen)
        setIsLoadingVerses(false);
    };

    const handleVerseSelect = (verse: number) => {
        if (!selectedBook || !selectedChapter) return;
        setIsOpen(false);

        const params = new URLSearchParams();
        params.set('book', selectedBook.name);
        params.set('chapter', selectedChapter.toString());
        params.set('verse', verse.toString()); // Pass verse param
        router.push(`/?${params.toString()}`);
    };

    const filteredBooks = BIBLE_BOOKS.filter(b =>
        b.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl hover:bg-gold/10 hover:border-gold/30 transition-all group"
            >
                <BookOpen className="w-5 h-5 text-zinc-400 group-hover:text-gold transition-colors" />
            </motion.button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">

                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal/Sheet */}
                        <motion.div
                            initial={{ y: '100%', opacity: 0, scale: 1 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: '100%', opacity: 0, scale: 1 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full md:w-[600px] h-[85vh] md:h-[600px] bg-[#0a0a0a] border-t md:border border-white/10 md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0">
                                <div className="flex items-center gap-3">
                                    {(step === 'chapters' || step === 'verses') && (
                                        <button
                                            onClick={() => {
                                                if (step === 'verses') setStep('chapters');
                                                else setStep('books');
                                            }}
                                            className="p-2 -ml-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                    )}
                                    <h2 className="text-xl font-light text-white tracking-widest uppercase">
                                        {step === 'books' && 'Libros'}
                                        {step === 'chapters' && selectedBook?.name}
                                        {step === 'verses' && `${selectedBook?.name} ${selectedChapter}`}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors"
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {step === 'books' && (
                                    <>
                                        <div className="mb-6 relative">
                                            <input
                                                type="text"
                                                placeholder="Filtrar libros..."
                                                value={filter}
                                                onChange={(e) => setFilter(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition-colors"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                            {filteredBooks.map((book) => (
                                                <motion.button
                                                    key={book.name}
                                                    layoutId={book.name}
                                                    onClick={() => handleBookSelect(book)}
                                                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-gold/10 hover:border-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all text-left group flex flex-col justify-between h-[100px]"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <span className="text-lg font-medium text-white/80 group-hover:text-gold transition-colors block truncate">
                                                        {book.name}
                                                    </span>
                                                    <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-gold/50">
                                                        {book.chapters} Caps
                                                    </span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {step === 'chapters' && selectedBook && (
                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4">
                                        {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                            <motion.button
                                                key={chapter}
                                                onClick={() => handleChapterSelect(chapter)}
                                                className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-gold/10 hover:border-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all flex items-center justify-center group"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <span className="text-xl font-light text-white/80 group-hover:text-gold">
                                                    {chapter}
                                                </span>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {step === 'verses' && (
                                    <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
                                        {isLoadingVerses ? (
                                            <div className="animate-pulse text-gold">Cargando oráculos...</div>
                                        ) : (
                                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 w-full">
                                                {Array.from({ length: versesCount }, (_, i) => i + 1).map((verse) => (
                                                    <motion.button
                                                        key={verse}
                                                        onClick={() => handleVerseSelect(verse)}
                                                        className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-gold/10 hover:border-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.1)] transition-all flex items-center justify-center group"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <span className="text-sm font-light text-white/80 group-hover:text-gold">
                                                            {verse}
                                                        </span>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
