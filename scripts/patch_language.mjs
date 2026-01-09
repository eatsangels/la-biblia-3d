import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const REPLACEMENTS = [
    { from: 'sobre la haz', to: 'sobre la faz' },
    { from: 'de la haz', to: 'de la faz' },
    { from: 'en la haz', to: 'en la faz' },
    { from: 'toda la haz', to: 'toda la faz' },
    { from: 'crió Dios', to: 'creó Dios' }, // Gen 1:1
    { from: 'y la tierra', to: 'Y la tierra' }, // Capitalization fix if needed, but 1909 is usually fine.
];

async function applyPatch() {
    console.log('Applying Modernization Patch...');

    for (const item of REPLACEMENTS) {
        console.log(`Replacing "${item.from}" with "${item.to}"...`);

        // We have to fetch rows, modify, and update because Supabase JS client 
        // doesn't support generic SQL 'UPDATE ... REPLACE(...)' easily without RPC.
        // And we don't have direct SQL console access here easily.
        // Actually, let's try to find rows and update them.

        let page = 0;
        let pageSize = 1000;
        let totalUpdated = 0;

        while (true) {
            const { data: rows, error } = await supabase
                .from('scriptures')
                .select('*') // Query ALL columns
                .ilike('content', `%${item.from}%`)
                .range(page * pageSize, (page + 1) * pageSize - 1);

            if (error) {
                console.error(error);
                break;
            }
            if (!rows || rows.length === 0) break;

            const updates = rows.map(row => {
                // simple replaceAll
                const newContent = row.content.split(item.from).join(item.to);

                // create clean object
                const updatePayload = { ...row, content: newContent };
                delete updatePayload.search_vector; // Generated column, cannot write to it

                return updatePayload;
            });

            // Upsert in batches
            const { error: upsertError } = await supabase
                .from('scriptures')
                .upsert(updates);

            if (upsertError) console.error('Upsert error:', upsertError);
            else totalUpdated += updates.length;

            if (rows.length < pageSize) break; // Finished
        }

        console.log(` -> Updated ${totalUpdated} verses.`);
    }

    console.log('Patch complete.');
}

applyPatch();
