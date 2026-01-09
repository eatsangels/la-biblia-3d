import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const SUPABASE_URL = 'https://axlovqnrqyyejikygvrg.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4bG92cW5ycXl5ZWppa3lndnJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzczMjQxOSwiZXhwIjoyMDgzMzA4NDE5fQ.uMefaEgMoJP4JehXWcHf-kRBFMx2rWL9WUgH0R3ZOe4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// URL for Reina Valera 1960 JSON
// Using thiagobodruk/bible repository as source
const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json';

async function downloadBible() {
    return new Promise((resolve, reject) => {
        https.get(BIBLE_JSON_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // Remove BOM if present
                    const cleanData = data.replace(/^\uFEFF/, '');
                    resolve(JSON.parse(cleanData));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Hardcoded Source of Truth for Names and Testament
const BIBLE_BOOKS = [
    // Old Testament
    { name: "Génesis", chapters: 50, testament: "Antiguo" },
    { name: "Éxodo", chapters: 40, testament: "Antiguo" },
    { name: "Levítico", chapters: 27, testament: "Antiguo" },
    { name: "Números", chapters: 36, testament: "Antiguo" },
    { name: "Deuteronomio", chapters: 34, testament: "Antiguo" },
    { name: "Josué", chapters: 24, testament: "Antiguo" },
    { name: "Jueces", chapters: 21, testament: "Antiguo" },
    { name: "Rut", chapters: 4, testament: "Antiguo" },
    { name: "1 Samuel", chapters: 31, testament: "Antiguo" },
    { name: "2 Samuel", chapters: 24, testament: "Antiguo" },
    { name: "1 Reyes", chapters: 22, testament: "Antiguo" },
    { name: "2 Reyes", chapters: 25, testament: "Antiguo" },
    { name: "1 Crónicas", chapters: 29, testament: "Antiguo" },
    { name: "2 Crónicas", chapters: 36, testament: "Antiguo" },
    { name: "Esdras", chapters: 10, testament: "Antiguo" },
    { name: "Nehemías", chapters: 13, testament: "Antiguo" },
    { name: "Ester", chapters: 10, testament: "Antiguo" },
    { name: "Job", chapters: 42, testament: "Antiguo" },
    { name: "Salmos", chapters: 150, testament: "Antiguo" },
    { name: "Proverbios", chapters: 31, testament: "Antiguo" },
    { name: "Eclesiastés", chapters: 12, testament: "Antiguo" },
    { name: "Cantares", chapters: 8, testament: "Antiguo" },
    { name: "Isaías", chapters: 66, testament: "Antiguo" },
    { name: "Jeremías", chapters: 52, testament: "Antiguo" },
    { name: "Lamentaciones", chapters: 5, testament: "Antiguo" },
    { name: "Ezequiel", chapters: 48, testament: "Antiguo" },
    { name: "Daniel", chapters: 12, testament: "Antiguo" },
    { name: "Oseas", chapters: 14, testament: "Antiguo" },
    { name: "Joel", chapters: 3, testament: "Antiguo" },
    { name: "Amós", chapters: 9, testament: "Antiguo" },
    { name: "Abdías", chapters: 1, testament: "Antiguo" },
    { name: "Jonás", chapters: 4, testament: "Antiguo" },
    { name: "Miqueas", chapters: 7, testament: "Antiguo" },
    { name: "Nahúm", chapters: 3, testament: "Antiguo" },
    { name: "Habacuc", chapters: 3, testament: "Antiguo" },
    { name: "Sofonías", chapters: 3, testament: "Antiguo" },
    { name: "Hageo", chapters: 2, testament: "Antiguo" },
    { name: "Zacarías", chapters: 14, testament: "Antiguo" },
    { name: "Malaquías", chapters: 4, testament: "Antiguo" },
    // New Testament
    { name: "Mateo", chapters: 28, testament: "Nuevo" },
    { name: "Marcos", chapters: 16, testament: "Nuevo" },
    { name: "Lucas", chapters: 24, testament: "Nuevo" },
    { name: "Juan", chapters: 21, testament: "Nuevo" },
    { name: "Hechos", chapters: 28, testament: "Nuevo" },
    { name: "Romanos", chapters: 16, testament: "Nuevo" },
    { name: "1 Corintios", chapters: 16, testament: "Nuevo" },
    { name: "2 Corintios", chapters: 13, testament: "Nuevo" },
    { name: "Gálatas", chapters: 6, testament: "Nuevo" },
    { name: "Efesios", chapters: 6, testament: "Nuevo" },
    { name: "Filipenses", chapters: 4, testament: "Nuevo" },
    { name: "Colosenses", chapters: 4, testament: "Nuevo" },
    { name: "1 Tesalonicenses", chapters: 5, testament: "Nuevo" },
    { name: "2 Tesalonicenses", chapters: 3, testament: "Nuevo" },
    { name: "1 Timoteo", chapters: 6, testament: "Nuevo" },
    { name: "2 Timoteo", chapters: 4, testament: "Nuevo" },
    { name: "Tito", chapters: 3, testament: "Nuevo" },
    { name: "Filemón", chapters: 1, testament: "Nuevo" },
    { name: "Hebreos", chapters: 13, testament: "Nuevo" },
    { name: "Santiago", chapters: 5, testament: "Nuevo" },
    { name: "1 Pedro", chapters: 5, testament: "Nuevo" },
    { name: "2 Pedro", chapters: 3, testament: "Nuevo" },
    { name: "1 Juan", chapters: 5, testament: "Nuevo" },
    { name: "2 Juan", chapters: 1, testament: "Nuevo" },
    { name: "3 Juan", chapters: 1, testament: "Nuevo" },
    { name: "Judas", chapters: 1, testament: "Nuevo" },
    { name: "Apocalipsis", chapters: 22, testament: "Nuevo" },
];

async function updateDatabase() {
    try {
        console.log('Downloading Reina Valera 1960...');
        const bibleData = await downloadBible();
        console.log('Download complete. Processing...');

        // Delete existing records
        console.log('Clearing existing scriptures...');
        const { error: deleteError } = await supabase
            .from('scriptures')
            .delete()
            .neq('id', 0); // Delete all

        if (deleteError) {
            console.error('Error clearing table:', deleteError);
            // Try to proceed anyway or optimize delete? 
            // If table is huge, this might timeout.
        }

        console.log('Inserting RV1960 data...');

        let versesToInsert = [];
        const BATCH_SIZE = 1000;

        // Iterate using JSON source but map to BIBLE_BOOKS by index
        for (let i = 0; i < bibleData.length; i++) {
            if (i >= BIBLE_BOOKS.length) break; // Safety check

            const sourceBook = bibleData[i];
            const targetMetadata = BIBLE_BOOKS[i]; // Use our canonical name and testament

            const bookName = targetMetadata.name;
            const testament = targetMetadata.testament;

            console.log(`Processing ${bookName} (${testament})...`);

            for (let chIndex = 0; chIndex < sourceBook.chapters.length; chIndex++) {
                const chapterNum = chIndex + 1;
                const verses = sourceBook.chapters[chIndex];

                for (let vIndex = 0; vIndex < verses.length; vIndex++) {
                    const verseNum = vIndex + 1;
                    const content = verses[vIndex];

                    versesToInsert.push({
                        book_name: bookName,
                        chapter: chapterNum,
                        verse_number: verseNum,
                        content: content,
                        testament: testament // Add required field
                    });

                    if (versesToInsert.length >= BATCH_SIZE) {
                        const { error } = await supabase.from('scriptures').insert(versesToInsert);
                        if (error) console.error('Error inserting batch:', error);
                        else process.stdout.write(`.`);
                        versesToInsert = [];
                    }
                }
            }
        }

        if (versesToInsert.length > 0) {
            const { error } = await supabase.from('scriptures').insert(versesToInsert);
            if (error) console.error('Error inserting final batch:', error);
        }

        console.log('\nMigration complete! Database is now Reina Valera 1960.');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

updateDatabase();
