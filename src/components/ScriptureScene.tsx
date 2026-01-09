'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScriptureSceneProps {
    content: string;
    book: string;
    chapter: number;
    verse: number;
    isActive: boolean;
}

export const ScriptureScene = ({ content, book, chapter, verse, isActive }: ScriptureSceneProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Split content into words for kinetic effect
    const words = content.split(' ');

    return (
        <section
            ref={containerRef}
            className="min-h-screen flex flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden"
        >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="max-w-4xl w-full text-center space-y-8"
            >
                {/* Caption */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isActive ? { opacity: 0.5 } : { opacity: 0.2 }}
                    className="text-gold uppercase tracking-[0.5em] text-xs font-bold"
                >
                    {book} {chapter}:{verse}
                </motion.p>

                {/* Cinematic Text */}
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-4">
                    {words.map((word, i) => (
                        <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.05,
                                ease: "easeOut"
                            }}
                            className={cn(
                                "text-4xl md:text-6xl font-serif tracking-tight leading-tight",
                                isActive ? "text-white" : "text-white/20"
                            )}
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            {/* Background Glow when active */}
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    className="absolute inset-0 bg-gold/10 blur-[100px] pointer-events-none"
                />
            )}
        </section>
    );
};
