const test = require('node:test');
const assert = require('node:assert');
const { greetUser } = require('./app.js');

test('greetUser should return a greeting message containing target text', () => {
    const greeting = greetUser();
    
    assert.ok(greeting);
    assert.strictEqual(typeof greeting, 'string');
    assert.ok(greeting.includes('¡Hola desde el Frontend optimizado!'));
});
