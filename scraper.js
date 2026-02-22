// Vietlott Data Scraper (Real Data from Minh Ngoc)
// Scrapes historical results from minhngoc.net.vn
// Run with: node scraper.js

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    power655: {
        name: 'Power 6/55',
        type: 'power-6x55',
        drawDays: [2, 4, 6], // Tuesday (2), Thursday (4), Saturday (6) - Note: getDay() returns 2,4,6 correctly
        maxNumber: 55,
        limit: 50 // Number of draws to crawl (adjust as needed)
    },
    mega645: {
        name: 'Mega 6/45',
        type: 'mega-6x45',
        drawDays: [3, 5, 0], // Wednesday (3), Friday (5), Sunday (0)
        maxNumber: 45,
        limit: 50 // Number of draws to crawl
    },
    baseUrl: 'https://www.minhngoc.net.vn'
};

// Data storage
const power655Data = {
    lotteryType: 'power655',
    lotteryName: 'Power 6/55',
    lastUpdated: new Date().toISOString(),
    totalDraws: 0,
    results: []
};

const mega645Data = {
    lotteryType: 'mega645',
    lotteryName: 'Mega 6/45',
    lastUpdated: new Date().toISOString(),
    totalDraws: 0,
    results: []
};

// Helper function to format date for URL (dd-mm-yyyy)
function formatDateForUrl(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// Helper function to format date for ID (YYYYMMDD)
function formatDateForId(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// Format date for display
function formatDateDisplay(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Helper to delay requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper to fetch HTML
function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url, options, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                // Return a specific object for redirects instead of following
                resolve({ redirect: true, location: res.headers.location });
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Status code: ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

// Helper to fetch HTML with retry
async function fetchHtmlWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchHtml(url);
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`⚠️ Retry ${i + 1}/${retries} for ${url}...`);
            await delay(2000 * (i + 1));
        }
    }
}

// Parse HTML to get result
function parseResult(html, lotteryType, date) {
    try {
        // Extract Numbers
        // Look for structure: <div class="finnishX bool">NUMBER</div>
        const numbers = [];
        const numberRegex = /<div class="finnish\d+ bool".*?>(\d+)<\/div>/g;
        let match;

        // Find all numbers
        const allNumbers = [];
        while ((match = numberRegex.exec(html)) !== null) {
            allNumbers.push(parseInt(match[1]));
        }

        // Validate number count
        if (allNumbers.length === 0) {
            console.log('No numbers found in HTML');
            return null; // No result found (maybe future date or no draw)
        }

        let mainNumbers, specialNumber;

        if (lotteryType === 'power655') {
            // Power 6/55: 6 main + 1 special
            // The 7th number in the list is usually the special number if parsed sequentially
            // But let's look for specific class if possible.
            // Based on debug output: <li class="number_special"><div class="finnish7 bool">20</div></li>

            // Extract special number strictly
            const specialRegex = /<li class="number_special">\s*<div class="finnish\d+ bool".*?>(\d+)<\/div>/;
            const specialMatch = html.match(specialRegex);

            if (specialMatch) {
                specialNumber = parseInt(specialMatch[1]);
                // Filter out special number from main numbers list to be safe
                // The allNumbers array might contain the special number at the end
                // Usually first 6 are main numbers
                mainNumbers = allNumbers.filter((n, index) => index < 6);
            } else {
                // Fallback: Last number is special
                specialNumber = allNumbers[allNumbers.length - 1];
                mainNumbers = allNumbers.slice(0, 6);
            }
        } else {
            // Mega 6/45: 6 main
            mainNumbers = allNumbers.slice(0, 6);
            specialNumber = null;
        }

        mainNumbers.sort((a, b) => a - b);

        // Extract Jackpot Values
        let jackpot1 = 0;
        let jackpot2 = 0;

        // IDs: DT6X55_G_JACKPOT, DT6X55_G_JACKPOT2 (Power)
        // IDs: DT6X45_G_JACKPOT (Mega)

        const jp1Regex = lotteryType === 'power655'
            ? /id="DT6X55_G_JACKPOT"[^>]*>([\d,]+)/
            : /id="DT6X45_G_JACKPOT"[^>]*>([\d,]+)/;

        const jp1Match = html.match(jp1Regex);
        if (jp1Match) {
            jackpot1 = parseInt(jp1Match[1].replace(/,/g, ''));
        }

        if (lotteryType === 'power655') {
            const jp2Regex = /id="DT6X55_G_JACKPOT2"[^>]*>([\d,]+)/;
            const jp2Match = html.match(jp2Regex);
            if (jp2Match) {
                jackpot2 = parseInt(jp2Match[1].replace(/,/g, ''));
            }
        }

        // Extract Winners Count
        let winners = {
            jackpot1: 0,
            jackpot2: 0,
            prize1: 0,
            prize2: 0,
            prize3: 0
        };

        // IDs for winners count: DT6X55_S_JACKPOT, DT6X55_S_G1, etc.
        const prefix = lotteryType === 'power655' ? 'DT6X55' : 'DT6X45';

        const extractCount = (idSuffix) => {
            const regex = new RegExp(`id="${prefix}_${idSuffix}"[^>]*>([\\d,]+)`);
            const m = html.match(regex);
            return m ? parseInt(m[1].replace(/,/g, '')) : 0;
        };

        winners.jackpot1 = extractCount('S_JACKPOT');
        if (lotteryType === 'power655') {
            winners.jackpot2 = extractCount('S_JACKPOT2');
        }
        winners.prize1 = extractCount('S_G1');
        winners.prize2 = extractCount('S_G2');
        winners.prize3 = extractCount('S_G3');

        // Draw ID (Create one if not found)
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        return {
            drawId: `${lotteryType === 'power655' ? 'P655' : 'M645'}-${formatDateForId(date)}`,
            date: formatDateForId(date),
            dayOfWeek: dayNames[date.getDay()],
            numbers: mainNumbers,
            specialNumber: specialNumber,
            jackpot1: jackpot1,
            jackpot2: jackpot2,
            winners: winners,
            timestamp: date.toISOString()
        };

    } catch (error) {
        console.error('Error parsing result:', error);
        return null; // Skip if parse error
    }
}

// Main crawl function for a lottery type
async function crawlLottery(key) {
    const config = CONFIG[key];
    console.log(`\n🚀 Starting crawl for ${config.name}...`);

    let crawledCount = 0;
    let currentDate = new Date();
    const results = [];

    // Safety break after checking 365 days back
    let daysChecked = 0;

    while (crawledCount < config.limit && daysChecked < 365) {
        // Check if current date is a draw day
        const dayOfWeek = currentDate.getDay();

        if (config.drawDays.includes(dayOfWeek)) {
            const dateStr = formatDateForUrl(currentDate);
            const url = `${CONFIG.baseUrl}/ket-qua-xo-so/dien-toan-vietlott/${config.type}/${dateStr}.html`;

            process.stdout.write(`Fetching ${dateStr}... `);

            try {
                const response = await fetchHtmlWithRetry(url);

                if (response.redirect) {
                    console.log(`❌ Skipped (Redirects to ${response.location})`);
                    // IMPORTANT: Move to next day before continuing
                    currentDate.setDate(currentDate.getDate() - 1);
                    daysChecked++;
                    continue;
                }

                const html = response;
                // Basic check if data exists (look for table)
                if (html.includes('id="DT6X')) {
                    const result = parseResult(html, key, currentDate);
                    if (result) {
                        results.push(result);
                        crawledCount++;
                        console.log(`✅ OK (Jackpot: ${(result.jackpot1 / 1e9).toFixed(1)} tỷ)`);
                    } else {
                        console.log(`⚠️ Parse failed or no result`);
                    }
                } else {
                    console.log(`Available but no data table (Future/Holiday?)`);
                }
            } catch (error) {
                // If 404 or other error, likely no draw this day or future date
                // But for 404 we should just skip
                if (error.message.includes('404')) {
                    console.log(`❌ Not found (404)`);
                } else {
                    console.log(`❌ Error: ${error.message}`);
                }
            }

            // Random delay 3000ms - 7000ms
            await delay(3000 + Math.random() * 4000);
        }

        // Go back 1 day
        currentDate.setDate(currentDate.getDate() - 1);
        daysChecked++;
    }

    console.log(`✅ Completed ${config.name}: Collected ${results.length} draws`);
    return results;
}

// Main execution
async function main() {
    console.log('🎰 Vietlott Data Scraper - Starting...');
    console.log('Source: minhngoc.net.vn');
    console.log('-----------------------------------');

    // Create data directory
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    try {
        // Crawl Power 6/55
        const p655Results = await crawlLottery('power655');
        power655Data.results = p655Results;
        power655Data.totalDraws = p655Results.length;

        // Crawl Mega 6/45
        const m645Results = await crawlLottery('mega645');
        mega645Data.results = m645Results;
        mega645Data.totalDraws = m645Results.length;

        // Save files
        fs.writeFileSync(
            path.join(dataDir, 'power655-results.json'),
            JSON.stringify(power655Data, null, 2)
        );

        fs.writeFileSync(
            path.join(dataDir, 'mega645-results.json'),
            JSON.stringify(mega645Data, null, 2)
        );

        // Export browser JS
        const browserExport = `
// Auto-generated historical data from scraper (Real Data)
// Source: minhngoc.net.vn
// Last updated: ${new Date().toISOString()}

window.HistoricalData = {
    power655: ${JSON.stringify(power655Data, null, 2)},
    mega645: ${JSON.stringify(mega645Data, null, 2)}
};

console.log('📊 Historical data loaded:', window.HistoricalData.power655.totalDraws + window.HistoricalData.mega645.totalDraws, 'total draws');
`;
        fs.writeFileSync(
            path.join(dataDir, 'historical-data.js'),
            browserExport
        );

        console.log('\n-----------------------------------');
        console.log('🎉 Scraping complete!');
        console.log(`💾 Data saved to ${dataDir}`);

    } catch (error) {
        console.error('Fatal error:', error);
    }
}

main();
