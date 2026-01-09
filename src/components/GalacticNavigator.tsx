'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronRight, BookOpen, Hash, ArrowLeft } from 'lucide-react';
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Main Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-[#0a0a0a]/95 border border-white/10 rounded-2xl shadow-blue-900/20 shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col h-[600px]"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5 bg-white/2">
                                {step !== 'books' && (
                                    <button
                                        onClick={() => step === 'verses' ? setStep('chapters') : setStep('books')}
                                        className="p-1 hover:bg-white/10 rounded-full transition-colors -ml-2"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-zinc-400" />
                                    </button>
                                )}

                                <div className="flex-1">
                                    <h2 className="text-2xl font-serif text-white flex items-center gap-2 tracking-wide">
                                        {step === 'books' ? 'SAGRADA ESCRITURA' : selectedBook?.name}
                                    </h2>
                                    <p className="text-xs text-gold/80 font-serif tracking-widest uppercase">
                                        {step === 'books' ? 'Seleccione un Libro' : step === 'chapters' ? 'Capítulo' : 'Versículo'}
                                    </p>
                                </div>

                                <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                                    {step === 'books' ? <BookOpen className="w-4 h-4 text-gold" /> : <Hash className="w-4 h-4 text-gold" />}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-hidden relative">
                                <AnimatePresence mode="wait">

                                    {/* STEP 1: BOOKS LIST */}
                                    {step === 'books' && (
                                        <motion.div
                                            key="books"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            className="h-full flex flex-col"
                                        >
                                            <div className="p-4 bg-black/20">
                                                <input
                                                    autoFocus
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-gold/30 transition-colors"
                                                    placeholder="Filtrar libros..."
                                                    value={filter}
                                                    onChange={(e) => setFilter(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar grid grid-cols-1 gap-1">
                                                {filteredBooks.map((book) => (
                                                    <button
                                                        key={book.name}
                                                        onClick={() => handleBookSelect(book)}
                                                        className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/5 group transition-all text-left"
                                                    >
                                                        <span className="text-zinc-300 group-hover:text-white font-serif">{book.name}</span>
                                                        <span className="text-[10px] uppercase tracking-wider text-zinc-600 group-hover:text-gold/50 bg-white/5 px-2 py-0.5 rounded-full">
                                                            {book.testament}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: CHAPTERS GRID */}
                                    {step === 'chapters' && selectedBook && (
                                        <motion.div
                                            key="chapters"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 20, opacity: 0 }}
                                            className="h-full overflow-y-auto p-6 custom-scrollbar"
                                        >
                                            <div className="grid grid-cols-5 gap-3">
                                                {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((chapter) => (
                                                    <button
                                                        key={chapter}
                                                        onClick={() => handleChapterSelect(chapter)}
                                                        className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-gold/10 hover:border-gold/40 hover:scale-105 hover:shadow-lg hover:shadow-gold/5 transition-all group"
                                                    >
                                                        <span className="text-lg font-mono text-zinc-400 group-hover:text-gold font-bold">
                                                            {chapter}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: VERSES GRID */}
                                    {step === 'verses' && (
                                        <motion.div
                                            key="verses"
                                            initial={{ x: 20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 20, opacity: 0 }}
                                            className="h-full overflow-y-auto p-6 custom-scrollbar"
                                        >
                                            {isLoadingVerses ? (
                                                <div className="flex items-center justify-center h-full text-gold/50 animate-pulse">
                                                    Cargando versículos...
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-5 gap-3">
                                                    {Array.from({ length: versesCount }, (_, i) => i + 1).map((verse) => (
                                                        <button
                                                            key={verse}
                                                            onClick={() => handleVerseSelect(verse)}
                                                            className="aspect-square flex items-center justify-center rounded-xl bg-white/5 border border-white/5 hover:bg-gold/10 hover:border-gold/40 hover:scale-105 hover:shadow-lg hover:shadow-gold/5 transition-all group"
                                                        >
                                                            <span className="text-sm font-mono text-zinc-400 group-hover:text-gold font-bold">
                                                                {verse}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
