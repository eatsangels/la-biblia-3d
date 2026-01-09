'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function AudioController() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false); // Lock for dragging
    const audioRef = useRef<HTMLAudioElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.volume = volume;
            audioRef.current.play().catch(e => console.log("Audio autoplay blocked:", e));
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

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed bottom-8 left-8 z-50 flex flex-col items-center gap-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => !isDragging && setIsHovered(false)} // Check lock
        >
            <audio
                ref={audioRef}
                src="/audio/ambient-drone.mp3"
                loop
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
                Ambiente
            </span>
        </div>,
        document.body
    );
}
