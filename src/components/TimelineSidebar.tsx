'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, History, BookOpen, ScrollText, Flame, MessageSquare, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const ERAS = [
    {
        name: 'Pentateuco',
        icon: ScrollText,
        description: 'La Creación y el Pacto',
        color: 'from-gold/40 to-amber-500/10',
        books: ['Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio'],
    },
    {
        name: 'Historia',
        icon: History,
        description: 'Conquista y Reinos',
        color: 'from-blue-400/30 to-indigo-500/5',
        books: ['Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes', '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester'],
    },
    {
        name: 'Poesía',
        icon: Flame,
        description: 'Sabiduría y Alabanza',
        color: 'from-rose-400/30 to-purple-500/5',
        books: ['Job', 'Salmos', 'Proverbios', 'Eclesiastés', 'Cantares'],
    },
    {
        name: 'Profetas',
        icon: MessageSquare,
        description: 'Llamado al Arrepentimiento',
        color: 'from-emerald-400/30 to-teal-500/5',
        books: ['Isaías', 'Jeremías', 'Lamentaciones', 'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas', 'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías'],
    },
    {
        name: 'Evangelios',
        icon: BookOpen,
        description: 'La Vida de Cristo',
        color: 'from-gold/60 to-white/5',
        books: ['Mateo', 'Marcos', 'Lucas', 'Juan'],
    },
    {
        name: 'Apóstoles',
        icon: Compass,
        description: 'La Iglesia Primitiva',
        color: 'from-cyan-400/30 to-sky-500/5',
        books: ['Hechos', 'Romanos', '1 Corintios', '2 Corintios', 'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'],
    },
];

export function TimelineSidebar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [activeEra, setActiveEra] = React.useState<string | null>(null);

    return (
        <>
            {/* Trigger Button - Sleek & Floating */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 group md:flex hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent group-hover:via-cyan-400 transition-colors" />
                <span className="[writing-mode:vertical-rl] text-xs tracking-[0.3em] font-medium text-white/70 group-hover:text-cyan-400 transition-colors uppercase">
                    Chronos Timeline
                </span>
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent group-hover:via-cyan-400 transition-colors" />
            </motion.button>

            {/* Mobile Trigger */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed left-4 top-24 z-40 p-2 md:hidden text-white/40 hover:text-white"
            >
                <History size={20} />
            </motion.button>

            {/* Glassmorphism Sidebar Panel */}
            <AnimatePresence mode="wait">
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 h-full w-[85vw] md:w-[400px] z-50 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl overflow-y-auto flex flex-col"
                        >
                            <div className="p-6 md:p-8 pb-4">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-light tracking-wider text-white">
                                            LÍNEA DE TIEMPO
                                        </h2>
                                        <p className="text-[10px] md:text-xs text-zinc-400 mt-1 uppercase tracking-widest">Eras de la Verdad</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 -mr-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <ChevronRight className="rotate-180" size={24} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {ERAS.map((era, index) => {
                                        const isActive = activeEra === era.name;
                                        return (
                                            <motion.div
                                                key={era.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={cn(
                                                    "relative overflow-hidden rounded-xl border transition-all duration-300 group cursor-pointer",
                                                    isActive
                                                        ? "bg-gradient-to-br border-white/20 shadow-lg shadow-black/20"
                                                        : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                                                )}
                                                onClick={() => setActiveEra(isActive ? null : era.name)}
                                            >
                                                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", era.color)} />

                                                <div className="relative p-6">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <div className={cn("p-2 rounded-lg bg-black/20", isActive ? "text-white" : "text-white/60")}>
                                                            <era.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h3 className={cn("font-medium tracking-wide", isActive ? "text-white" : "text-white/80")}>
                                                                {era.name}
                                                            </h3>
                                                            <p className="text-[10px] uppercase tracking-wider text-white/40">{era.description}</p>
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {isActive && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                                                                    {era.books.map((book) => (
                                                                        <span
                                                                            key={book}
                                                                            className="text-sm text-white/60 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-white/5"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                window.location.search = `?book=${encodeURIComponent(book)}`;
                                                                            }}
                                                                        >
                                                                            {book}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
