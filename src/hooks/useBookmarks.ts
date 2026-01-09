'use client';

import { useState, useEffect } from 'react';
import { Scripture } from '@/lib/types';
import { toast } from 'sonner';

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Scripture[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('bible_bookmarks');
        if (saved) {
            try {
                setBookmarks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse bookmarks", e);
            }
        }
    }, []);

    const saveBookmark = (verse: Scripture) => {
        const exists = bookmarks.some(b => b.id === verse.id);
        if (exists) {
            toast.info("Este versículo ya está guardado.");
            return;
        }

        const newBookmarks = [...bookmarks, verse];
        setBookmarks(newBookmarks);
        localStorage.setItem('bible_bookmarks', JSON.stringify(newBookmarks));
        toast.success("Versículo guardado en tu colección.");
    };

    const removeBookmark = (id: number) => {
        const newBookmarks = bookmarks.filter(b => b.id !== id);
        setBookmarks(newBookmarks);
        localStorage.setItem('bible_bookmarks', JSON.stringify(newBookmarks));
        toast.info("Versículo eliminado.");
    };

    const isBookmarked = (id: number) => {
        return bookmarks.some(b => b.id === id);
    };

    return { bookmarks, saveBookmark, removeBookmark, isBookmarked, mounted };
}
