
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function getAllBooks() {
    let allBooks = new Set();
    let from = 0;
    const step = 1000;
    let keepGoing = true;

    console.log('Fetching all records to find distinct books...');

    while (keepGoing) {
        const { data, error } = await supabase
            .from('scriptures')
            .select('book_name')
            .range(from, from + step - 1);

        if (error) {
            console.error('Error:', error.message);
            break;
        }

        if (data.length === 0) {
            keepGoing = false;
        } else {
            data.forEach(d => allBooks.add(d.book_name));
            from += step;
            process.stdout.write('.');
        }
    }

    console.log('\nDistinct books found:', Array.from(allBooks).sort().join(', '));
    console.log('Total unique books:', allBooks.size);
}

getAllBooks();
