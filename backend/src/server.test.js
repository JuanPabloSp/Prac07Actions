const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { startServer, stopServer } = require('./server.js');

const TEST_PORT = 3001;

test('Backend Server integration tests', async (t) => {
    // Start server before running tests
    const serverInstance = await startServer(TEST_PORT);

    await t.test('GET /api/health returns status UP', async () => {
        return new Promise((resolve, reject) => {
            http.get(`http://localhost:${TEST_PORT}/api/health`, (res) => {
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(res.headers['content-type'], 'application/json');
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const body = JSON.parse(data);
                    assert.strictEqual(body.status, 'UP');
                    resolve();
                });
            }).on('error', reject);
        });
    });

    await t.test('GET /api/info returns version and component details', async () => {
        return new Promise((resolve, reject) => {
            http.get(`http://localhost:${TEST_PORT}/api/info`, (res) => {
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(res.headers['x-powered-by'], 'Optimized-Monorepo-Backend');
                
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const body = JSON.parse(data);
                    assert.strictEqual(body.component, 'backend');
                    assert.strictEqual(body.version, '1.0.0');
                    resolve();
                });
            }).on('error', reject);
        });
    });

    await t.test('GET /invalid-route returns 404', async () => {
        return new Promise((resolve, reject) => {
            http.get(`http://localhost:${TEST_PORT}/invalid-route`, (res) => {
                assert.strictEqual(res.statusCode, 404);
                resolve();
            }).on('error', reject);
        });
    });

    // Tear down server
    await stopServer();
});
