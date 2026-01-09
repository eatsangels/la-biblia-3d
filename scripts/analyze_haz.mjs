import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function analyzeHaz() {
    console.log('Searching for "haz"...');

    const { data, error, count } = await supabase
        .from('scriptures')
        .select('book_name, chapter, verse_number, content')
        .textSearch('search_vector', 'haz') // Use Full Text Search if available or ilike
        .limit(100);

    // Fallback if FTS not set up for 'haz' specifically or tokenization issues
    const { data: likeData, error: likeError } = await supabase
        .from('scriptures')
        .select('book_name, chapter, verse_number, content')
        .ilike('content', '% haz %'); // Space padding to avoid "hacer"

    if (likeData) {
        console.log(`Found ${likeData.length} occurrences of " haz ".`);
        likeData.slice(0, 5).forEach(v => {
            console.log(`[${v.book_name} ${v.chapter}:${v.verse_number}] ${v.content}`);
        });
    }

    // Also check "sobre la haz" specific phrase which is the target
    const { data: phraseData } = await supabase
        .from('scriptures')
        .select('*')
        .ilike('content', '%sobre la haz%');

    if (phraseData) {
        console.log(`\nFound ${phraseData.length} occurrences of "sobre la haz". (Target for replacement)`);
        phraseData.slice(0, 5).forEach(v => {
            console.log(`[${v.book_name} ${v.chapter}:${v.verse_number}] ${v.content}`);
        });
    }
}

analyzeHaz();
