import https from 'https';

const CANDIDATES = [
    'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr1960.json',
    'https://raw.githubusercontent.com/thiagobodruk/bible/master/json/es_rvr.json', // We know this is 1909, but checking logic
    'https://raw.githubusercontent.com/semool/biblia-json/master/RVR1960.json',
    'https://raw.githubusercontent.com/GospelAid/bibles/master/es-RVR1960.json',
    'https://raw.githubusercontent.com/godlytalias/Bible-Database/master/json/es_rvr1960.json'
];

async function checkUrl(url) {
    return new Promise((resolve) => {
        console.log(`Checking ${url}...`);

        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                console.log(`-> Status: ${res.statusCode} (Skipping)`);
                res.destroy();
                resolve(null);
                return;
            }

            let data = '';
            let found = false;

            res.on('data', (chunk) => {
                data += chunk;
                if (!found && data.length > 2000) {
                    found = true;
                    res.destroy(); // Stop download

                    const lower = data.toLowerCase();
                    const hasFaz = lower.includes('faz del abismo');
                    const hasHaz = lower.includes('haz del abismo');
                    const isGenesis = lower.includes('génesis') || lower.includes('genesis');

                    if (isGenesis && hasFaz) {
                        console.log('-> SUCCESS! Found "faz del abismo" (RVR1960)');
                        resolve(url);
                    } else if (isGenesis && hasHaz) {
                        console.log('-> Found "haz del abismo" (Likely 1909/Antigua)');
                        resolve(null);
                    } else {
                        console.log('-> Content ambiguous or not Genesis start.');
                        // Print snippet to debug
                        console.log(data.substring(0, 200));
                        resolve(null);
                    }
                }
            });

            res.on('end', () => {
                if (!found) resolve(null);
            });

            res.on('error', () => resolve(null));

        });

        req.on('error', (e) => {
            console.log(`-> Connection Error: ${e.message}`);
            resolve(null);
        });
    });
}

(async () => {
    for (const url of CANDIDATES) {
        const successUrl = await checkUrl(url);
        if (successUrl) {
            console.log(`\nWINNER: ${successUrl}`);
            process.exit(0);
        }
    }
    console.log('\nNo suitable RVR1960 source found in candidates.');
})();
