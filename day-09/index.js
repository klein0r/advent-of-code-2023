'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));
const rows = text.split('\n')
    .map(r => r.split(' ').map(v => parseInt(v)));

function getDiffs(values) {
    const diffs = [];
    for (let i = 0; i < values.length - 1; i++) diffs.push(values[i + 1] - values[i]);
    return diffs;
}

function getNext(values) {
    const ladder = [];

    do {
        ladder.push(values.slice(-1).pop());
        values = getDiffs(values);
    } while(values.filter(v => v !== 0).length > 0);

    return ladder.reduce((acc, c) => acc + c, 0);
}

// Round 1
let lastTotal = 0;

for (const row of rows) {
    lastTotal += getNext(row);;
}

console.log('Round 1:');
console.log(lastTotal);

// Round 2
let firstTotal = 0;

for (const row of rows) {
    firstTotal += getNext(row.reverse());
}

console.log('Round 2:');
console.log(firstTotal);
