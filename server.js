const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const DATA_DIR = path.join(__dirname, 'data');
const SCRAPER_SCRIPT = path.join(__dirname, 'scraper.js');

// MIME types configuration
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Scheduler configuration
const SCHEDULE_HOUR = 18;
const SCHEDULE_MINUTE = 45;

let isUpdating = false;

// Function to run the scraper
function runScraper() {
    if (isUpdating) {
        console.log('Update already in progress...');
        return;
    }

    console.log('🔄 Starting scheduled data update...');
    isUpdating = true;

    exec(`node "${SCRAPER_SCRIPT}"`, (error, stdout, stderr) => {
        isUpdating = false;
        if (error) {
            console.error(`❌ Update failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Scraper stderr: ${stderr}`);
        }
        console.log(`✅ Update completed:\n${stdout}`);
    });
}

// Scheduler loop (checks every minute)
setInterval(() => {
    const now = new Date();
    // Check if it's the scheduled time (18:45)
    if (now.getHours() === SCHEDULE_HOUR && now.getMinutes() === SCHEDULE_MINUTE) {
        console.log(`⏰ It's ${SCHEDULE_HOUR}:${SCHEDULE_MINUTE}. Triggering auto-update.`);
        runScraper();
    }
}, 60000); // Check every 60 seconds

// Create HTTP server
const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Manual update endpoint
    if (req.url === '/update-now') {
        runScraper();
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Đã kích hoạt cập nhật dữ liệu. Kiểm tra terminal server để xem chi tiết.');
        return;
    }

    // Serve static files
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                fs.readFile('./404.html', (error, content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content || '404 Not Found', 'utf-8');
                });
            } else {
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Server running at http://localhost:${PORT}/`);
    console.log(`📅 Auto-update scheduled for ${SCHEDULE_HOUR}:${SCHEDULE_MINUTE} daily.`);
    console.log(`👉 Trigger manual update at: http://localhost:${PORT}/update-now\n`);
});
