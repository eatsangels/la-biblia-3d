
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function checkBooks() {
    const { data, error } = await supabase
        .from('scriptures')
        .select('book_name')
        .order('book_name', { ascending: true });

    if (error) {
        console.error('Error fetching books:', error.message);
        return;
    }

    const distinctBooks = [...new Set(data.map(d => d.book_name))];
    console.log('Distinct books in database:', distinctBooks.join(', '));
    console.log('Total books count:', distinctBooks.length);
}

checkBooks();
