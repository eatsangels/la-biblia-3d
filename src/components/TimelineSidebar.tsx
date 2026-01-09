'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, History, BookOpen, ScrollText, Flame, MessageSquare, Compass, ShieldCheck } from 'lucide-react';
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
                className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent group-hover:via-cyan-400 transition-colors" />
                <span className="[writing-mode:vertical-rl] text-xs tracking-[0.3em] font-medium text-white/70 group-hover:text-cyan-400 transition-colors uppercase">
                    Chronos Timeline
                </span>
                <div className="h-24 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent group-hover:via-cyan-400 transition-colors" />
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
                            className="fixed left-0 top-0 h-full w-[400px] z-50 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 shadow-2xl overflow-y-auto flex flex-col"
                        >
                            <div className="p-8 pb-4">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h2 className="text-2xl font-light tracking-wider text-white">
                                            LÍNEA DE TIEMPO
                                        </h2>
                                        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">Eras de la Verdad</p>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                    >
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <ChevronRight className="w-6 h-6 text-white/70 rotate-180" />
                                        </div>
                                    </button>
                                </div>

                                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-6 relative custom-scrollbar">
                                {/* Vertical Line Guide */}
                                <div className="absolute left-[34px] top-0 bottom-0 w-[1px] bg-white/5" />

                                {ERAS.map((era) => (
                                    <motion.div
                                        key={era.name}
                                        className={cn(
                                            "relative pl-10 group cursor-pointer transition-all duration-300",
                                            activeEra === era.name ? "opacity-100" : "opacity-60 hover:opacity-100"
                                        )}
                                        onMouseEnter={() => setActiveEra(era.name)}
                                    >
                                        {/* Timeline Dot */}
                                        <div className={cn(
                                            "absolute left-[13px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10",
                                            activeEra === era.name
                                                ? "bg-cyan-500 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                : "bg-black border-white/20 group-hover:border-white/50"
                                        )} />

                                        <div className={cn(
                                            "p-5 rounded-xl border transition-all duration-300 backdrop-blur-md",
                                            activeEra === era.name
                                                ? "bg-white/10 border-cyan-500/30 shadow-lg shadow-cyan-900/20"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                        )}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <era.icon className={cn(
                                                    "w-4 h-4 transition-colors",
                                                    activeEra === era.name ? "text-cyan-400" : "text-white/50"
                                                )} />
                                                <span className="text-sm font-bold tracking-wide text-white font-serif uppercase">
                                                    {era.name}
                                                </span>
                                            </div>

                                            <p className="text-xs text-zinc-400 mb-4 font-light">
                                                {era.description}
                                            </p>

                                            {/* Books Grid */}
                                            <AnimatePresence>
                                                {activeEra === era.name && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10"
                                                    >
                                                        {era.books.map((book) => (
                                                            <motion.button
                                                                key={book}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setIsOpen(false);
                                                                    window.location.search = `?book=${encodeURIComponent(book)}`;
                                                                }}
                                                                whileHover={{ x: 2, color: '#22d3ee' }}
                                                                className="text-left text-[10px] text-zinc-400 transition-colors flex items-center gap-1.5"
                                                            >
                                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                                {book}
                                                            </motion.button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-black/20 text-center">
                                <span className="text-[10px] text-zinc-600 tracking-[0.2em] font-light">
                                    THE LIVING WORD • ALPHA 1.0
                                </span>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
