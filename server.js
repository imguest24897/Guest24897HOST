const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'src');
const ERROR_PAGES_DIR = __dirname;

console.clear
console.info("Guest24897HOST V1.0.1")
console.info("Web-server hosting made easy!")
console.info("")
console.log("LOG: Adding files to web-server from folder src . . .")
console.info("")

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url === '/' ? 'index.html' : req.url);
    let contentType = getContentType(filePath);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found, serve 404 page
                serveErrorPage(res, 404);
            } else {
                // Other server error
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            // Success, serve the file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        default:
            return 'text/plain';
    }
}

function serveErrorPage(res, statusCode) {
    let errorPagePath = path.join(ERROR_PAGES_DIR, `${statusCode}.html`);
    fs.readFile(errorPagePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end('Server Error');
        } else {
            res.writeHead(statusCode, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
}

// Executes when pages adding complete
server.listen(PORT, () => {
    console.log(`Server started and running on port ${PORT}.`);
    console.log(` • You can visit your hosted server on http://localhost:${PORT}`);
});
