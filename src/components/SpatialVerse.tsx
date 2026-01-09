'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface SpatialVerseProps {
    content: string;
    book: string;
    chapter: number;
    verse: number;
    theme?: string;
}

export const SpatialVerse = ({
    content,
    book,
    chapter,
    verse,
    theme = 'nebula',
}: SpatialVerseProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Spatial effects: Depth (Z-axis), Opacity, and Blur
    const z = useTransform(scrollYProgress, [0, 0.5, 1], [-200, 0, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0, 0.3, 1, 0.3, 0]);
    const blur = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, 10]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);

    return (
        <div
            ref={ref}
            className="h-screen flex items-center justify-center perspective-1000 sticky top-0"
        >
            <motion.div
                style={{
                    z,
                    opacity,
                    scale,
                    filter: `blur(${blur}px)`,
                }}
                className={cn(
                    "max-w-4xl px-8 text-center transition-all duration-300",
                    "hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                )}
            >
                <div className="mb-4 text-xs tracking-[0.3em] uppercase opacity-50 font-light">
                    {book} {chapter}:{verse}
                </div>
                <h2 className="text-3xl md:text-5xl font-serif text-white/90 leading-tight">
                    {content}
                </h2>

                {/* Dynamic Glow Element */}
                <div className="mt-8 flex justify-center">
                    <div className={cn(
                        "w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent",
                        theme === 'fire' && "via-orange-500/50",
                        theme === 'water' && "via-cyan-400/50"
                    )} />
                </div>
            </motion.div>
        </div>
    );
};
