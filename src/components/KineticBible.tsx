'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// Dynamically import Canvas to avoid Hydration Error (SSR mismatch)
const UniverseCanvas = dynamic(() => import('./canvas/UniverseCanvas'), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-[#02040a]" />
});
import AudioController from './AudioController';
import SearchOverlay from './SearchOverlay';
import { Scripture } from '@/lib/types';

interface KineticBibleProps {
    initialVerses: Scripture[];
    targetVerse?: number;
}

export default function KineticBible({ initialVerses, targetVerse }: KineticBibleProps) {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isRestored, setIsRestored] = useState(false);

    // Reset scroll and state when initialVerses change (New Book Navigation)
    useEffect(() => {
        window.scrollTo(0, 0);
        setScrollProgress(0);
        // We don't clear localStorage because the user might want to persist 
        // their position in the current book.
    }, [initialVerses]);

    // RESTORE Progress
    useEffect(() => {
        const saved = localStorage.getItem('genesis_travel_progress');
        if (saved) {
            const ratio = parseFloat(saved);
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            window.scrollTo(0, ratio * height);
            setScrollProgress(ratio);
        }
        setIsRestored(true);
    }, []);

    // SAVE Progress (with debouncing or interval)
    useEffect(() => {
        if (!isRestored) return;

        const handleScroll = () => {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? winScroll / height : 0;
            setScrollProgress(scrolled);

            // Save to localStorage
            localStorage.setItem('genesis_travel_progress', scrolled.toString());
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isRestored]);

    // AUTO-SCROLL to Target Verse
    useEffect(() => {
        if (targetVerse && initialVerses.length > 0) {
            const index = initialVerses.findIndex(v => v.verse_number === targetVerse);
            if (index !== -1) {
                // Determine precision scroll
                // scrollProgress = index / length;
                const ratio = index / initialVerses.length;
                // Add a small offset to center it?
                // Actually UniverseCanvas uses linear mapping, so direct ratio should be close.
                setScrollProgress(ratio);

                // Also sync window scroll
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                window.scrollTo(0, ratio * height);

                // Mark as restored so we don't overwrite with 0 immediately
                setIsRestored(true);
            }
        }
    }, [targetVerse, initialVerses]);

    // Current Verse Calculation for HUD
    const currentVerseIndex = Math.min(
        initialVerses.length - 1,
        Math.floor(scrollProgress * initialVerses.length)
    );
    const currentVerse = initialVerses[currentVerseIndex] || initialVerses[0];

    return (
        <div className="relative h-[2000vh] bg-blue-900">
            {/* Scroll Area Trigger */}
            <div className="absolute inset-0" />
            {/* 
        We use a very large height (2000vh) to give plenty of "flight distance" 
        for the verses spaced out in the 3D tunnel.
      */}
            <UniverseCanvas scrollProgress={scrollProgress} verses={initialVerses} />

            {/* Narrative Overlay (Fade out on scroll) */}
            <div
                className="fixed inset-0 z-10 pointer-events-none flex flex-col items-center justify-start pt-32 transition-opacity duration-300 ease-out"
                style={{ opacity: Math.max(0, 1 - scrollProgress * 50) }} // Fades out quickly
            >
                <div className="text-center space-y-4">
                    <h2 className="text-7xl md:text-9xl font-serif text-white tracking-tight uppercase drop-shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                        {initialVerses[0]?.book_name || "La Biblia"}
                    </h2>

                    <div className="flex items-center justify-center gap-4 opacity-80">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold" />
                        <p className="text-xl md:text-2xl font-serif tracking-[0.2em] text-gold uppercase">
                            Capítulo {initialVerses[0]?.chapter || "1"}
                        </p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold" />
                    </div>
                </div>
            </div>

            {/* Reading HUD (Persistent) */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-1">
                <div className="px-6 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-gold/20 shadow-2xl flex items-center gap-3">
                    <span className="text-gold font-serif tracking-widest uppercase text-xs md:text-sm">
                        {currentVerse.book_name} {currentVerse.chapter}
                    </span>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <span className="text-white font-mono font-bold text-sm md:text-base min-w-[3ch] text-center">
                        :{currentVerse.verse_number}
                    </span>
                </div>
                {/* Progress Mini Bar */}
                <div className="w-32 h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gold transition-all duration-100 ease-out"
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
            </div>

            {/* Narrative Guide (Minimal Footer) */}
            <div className="fixed bottom-12 right-12 z-20 pointer-events-none text-right hidden md:block">
                <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">Infinite Travel Active</p>
            </div>

            {/* Integrated Audio Controller */}
            <AudioController currentBook={currentVerse.book_name} />

            {/* Search Overlay */}
            <SearchOverlay />
        </div>
    );
}
