// Backend Application Server
const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Powered-By', 'Optimized-Monorepo-Backend');
    
    if (req.url === '/api/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'UP', timestamp: new Date().toISOString() }));
    } else if (req.url === '/api/info') {
        res.writeHead(200);
        res.end(JSON.stringify({ 
            component: 'backend',
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development' 
        }));
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

function startServer(port = PORT) {
    return new Promise((resolve) => {
        server.listen(port, () => {
            console.log(`📡 Backend server listening on port ${port}`);
            resolve(server);
        });
    });
}

function stopServer() {
    return new Promise((resolve) => {
        server.close(() => {
            console.log('🛑 Backend server stopped');
            resolve();
        });
    });
}

if (require.main === module) {
    startServer();
}

module.exports = { startServer, stopServer, server };
