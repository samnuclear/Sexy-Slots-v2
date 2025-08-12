const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Extract parseCSV function from index.html
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('function parseCSV');
if (start === -1) throw new Error('parseCSV not found');
const braceStart = html.indexOf('{', start);
let i = braceStart + 1;
let depth = 1;
while (depth > 0 && i < html.length) {
  const ch = html[i++];
  if (ch === '{') depth++;
  else if (ch === '}') depth--;
}
const fnSrc = html.slice(start, i);
const parseCSV = new Function(fnSrc + '; return parseCSV;')();

test('parseCSV parses simple CSV text', () => {
  const csv = 'a,b\nc,d';
  const rows = parseCSV(csv);
  assert.deepStrictEqual(rows, [{ a: 'c', b: 'd' }]);
});
