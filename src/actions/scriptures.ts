'use server';

import { createClient } from '@/utils/supabase/server';
import { Scripture } from '@/lib/types';

export async function getScriptures({
    page = 0,
    pageSize = 20,
    book,
    chapter,
}: {
    page?: number;
    pageSize?: number;
    book?: string;
    chapter?: number;
} = {}): Promise<Scripture[]> {
    const supabase = createClient();

    let query = supabase
        .from('scriptures')
        .select('*')
        .order('id', { ascending: true })
        .range(page * pageSize, (page + 1) * pageSize - 1);

    if (book) {
        query = query.eq('book_name', book);
    }
    if (chapter) {
        query = query.eq('chapter', chapter);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching scriptures:', error);
        return [];
    }

    return (data as Scripture[]) || [];
}

export async function searchScriptures(term: string): Promise<Scripture[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('scriptures')
        .select('*')
        .textSearch('search_vector', term, {
            type: 'websearch',
            config: 'spanish',
        })
        .limit(50);

    if (error) {
        console.error('Error searching scriptures:', error);
        return [];
    }

    return (data as Scripture[]) || [];
}

export async function getVerseCount(book: string, chapter: number): Promise<number> {
    const supabase = createClient();

    const { count, error } = await supabase
        .from('scriptures')
        .select('*', { count: 'exact', head: true })
        .eq('book_name', book)
        .eq('chapter', chapter);

    if (error) {
        console.error('Error counting verses:', error);
        return 0;
    }

    return count || 0;
}
