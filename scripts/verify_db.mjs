import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    console.log('Verifying DB content (RV1960)...');

    // Check Genesis 1:2
    const { data: v2 } = await supabase
        .from('scriptures')
        .select('content')
        .eq('book_name', 'Génesis')
        .eq('chapter', 1)
        .eq('verse_number', 2)
        .single();

    console.log('Genesis 1:2:', v2?.content);


    // Check Total Count
    const { count } = await supabase.from('scriptures').select('*', { count: 'exact', head: true });
    console.log('Total verses:', count);
}

verify();
