'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { createPortal } from 'react-dom';

// Era Audio Map
const ERA_TRACKS: Record<string, string> = {
    'Génesis': '/audio/creation.mp3', // Future file
    'Mateo': '/audio/gospels.mp3',
    'Apocalipsis': '/audio/revelation.mp3',
    // Fallback
    'default': '/audio/ambient-drone.mp3'
};

interface AudioControllerProps {
    currentBook: string;
}

export default function AudioController({ currentBook }: AudioControllerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [mounted, setMounted] = useState(false);

    // Determine track based on book grouping
    const getTrackForBook = (book: string) => {
        const b = book;
        if (['Mateo', 'Marcos', 'Lucas', 'Juan'].includes(b)) return ERA_TRACKS['Mateo'];
        if (b === 'Apocalipsis') return ERA_TRACKS['Apocalipsis'];
        // Add more mappings here
        return ERA_TRACKS['default'];
    };

    const activeTrack = getTrackForBook(currentBook || 'Génesis');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle Track Switching
    useEffect(() => {
        if (!audioRef.current || !isPlaying) return;

        // Simple crossfade logic could go here, for now we just swap source
        // Check if source actually changed to avoid re-buffering same track
        const currentSrc = audioRef.current.getAttribute('src');
        if (currentSrc !== activeTrack) {
            // In a perfect world, we'd crossfade. For now, we accept the cut.
            // Or better: Use two audio elements. Keeping it simple v1.
            // We can check if the file exists by just letting the error handler fallback?
            // No, let's stick to the default for ALL for now to ensure it works, 
            // but keep the logic structure.
        }
    }, [activeTrack, isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.volume = volume;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    console.log("Audio autoplay blocked or file missing:", e);
                    // Fallback to default if specific track fails?
                });
            }
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVol = parseFloat(e.target.value);
        setVolume(newVol);
        if (audioRef.current) {
            audioRef.current.volume = newVol;
        }
    };

    // Error handling for missing tracks
    const handleAudioError = () => {
        if (audioRef.current && audioRef.current.src !== ERA_TRACKS['default']) {
            console.warn(`Track ${activeTrack} missing, falling back.`);
            audioRef.current.src = ERA_TRACKS['default'];
            if (isPlaying) audioRef.current.play();
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed bottom-8 left-8 z-50 flex flex-col items-center gap-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => !isDragging && setIsHovered(false)}
        >
            <audio
                ref={audioRef}
                src={activeTrack} // Dynamic Track
                loop
                onError={handleAudioError}
            />

            {/* Volume Slider (Reveals on Hover) */}
            <div
                className={`
                    bg-white/10 backdrop-blur-md rounded-full p-2 mb-2 transition-all duration-300 overflow-hidden flex flex-col justify-end
                    ${isHovered || isDragging ? 'h-32 opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4 pointer-events-none'}
                `}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    onMouseDown={(e) => { setIsDragging(true); e.stopPropagation(); }}
                    onMouseUp={(e) => { setIsDragging(false); e.stopPropagation(); }}
                    className="h-full w-2 accent-gold cursor-pointer"
                    style={{ writingMode: 'vertical-lr', WebkitAppearance: 'slider-vertical' }}
                />
            </div>

            {/* Toggle Button */}
            <button
                onClick={togglePlay}
                className={`
                    p-3 rounded-full backdrop-blur-md border transition-all duration-500
                    ${isPlaying
                        ? 'bg-gold/20 border-gold text-gold shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                    }
                `}
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>

            <span className={`
                absolute left-14 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-gold whitespace-nowrap pointer-events-none transition-all duration-500
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
            `}>
                {activeTrack.includes('ambient') ? 'Ambiente' : 'Banda Sonora'}
            </span>
        </div>,
        document.body
    );
}
