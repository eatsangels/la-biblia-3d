export interface Scripture {
    id: number;
    testament: string;
    book_name: string;
    chapter: number;
    verse_number: number;
    content: string;
    visual_theme: string;
    search_vector?: string;
}
