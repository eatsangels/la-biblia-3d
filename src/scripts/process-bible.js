
const { bookMapping } = require('./book-mapping');
const fs = require('fs');
const path = require('path');

async function run() {
    console.log('Fetching Bible data...');
    const response = await fetch('https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json');
    const bible = await response.json();

    const getTheme = (bookName) => {
        if (bookName === "Génesis") return "nebula";
        if (bookName === "Éxodo") return "sand";
        if (bookName === "Salmos") return "water";
        if (bookName === "Apocalipsis") return "fire";
        if (["Isaías", "Jeremías", "Ezequiel", "Daniel"].includes(bookName)) return "deep-space";
        if (["Mateo", "Marcos", "Lucas", "Juan"].includes(bookName)) return "divine-light";
        return "cosmic";
    };

    const allVerses = [];

    for (const book of bible) {
        const mapping = bookMapping[book.abbrev];
        if (!mapping) {
            console.warn(`No mapping for block ${book.abbrev}`);
            continue;
        }

        const bookName = mapping.name;
        const testament = mapping.testament;
        const theme = getTheme(bookName);

        book.chapters.forEach((chapter, chapterIdx) => {
            chapter.forEach((content, verseIdx) => {
                allVerses.push({
                    testament,
                    book_name: bookName,
                    chapter: chapterIdx + 1,
                    verse_number: verseIdx + 1,
                    content: content.replace(/'/g, "''"), // Escape single quotes for SQL
                    visual_theme: theme
                });
            });
        });
    }

    console.log(`Total verses processed: ${allVerses.length}`);

    const batchSize = 1000;
    const outputDir = path.join(process.cwd(), 'bible_batches');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    // Clear existing files in outputDir
    fs.readdirSync(outputDir).forEach(file => fs.unlinkSync(path.join(outputDir, file)));

    for (let i = 0; i < allVerses.length; i += batchSize) {
        const batch = allVerses.slice(i, i + batchSize);
        const values = batch.map(v =>
            `('${v.testament}', '${v.book_name}', ${v.chapter}, ${v.verse_number}, '${v.content}', '${v.visual_theme}')`
        ).join(",\n");

        const sql = `INSERT INTO scriptures (testament, book_name, chapter, verse_number, content, visual_theme) VALUES\n${values};`;

        const fileName = `batch_${Math.floor(i / batchSize).toString().padStart(3, '0')}.sql`;
        fs.writeFileSync(path.join(outputDir, fileName), sql);
    }
    console.log('Batch files generated in ./bible_batches');
}

run().catch(console.error);
