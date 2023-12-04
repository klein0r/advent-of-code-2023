'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));
let rows = text.split('\n');

function getMatchingCardsCnt(row) {
    const matches = row.match(/^Card\s+([0-9]{1,3}): ([0-9 ]+)\|([0-9 ]+)$/);
    const winning = matches[2].split(' ').filter(n => n).map(n => parseInt(n));
    const myCards = matches[3].split(' ').filter(n => n).map(n => parseInt(n));

    return winning.reduce((acc, n) => myCards.includes(n) ? ++acc : acc, 0);
}

function toPoints(matches) {
    return matches > 0 ? Math.pow(2, matches - 1): 0;
}

let totalPoints = 0;
let copyCards = [];

for (let r = 0; r < rows.length; r++) {
    const matches = getMatchingCardsCnt(rows[r]);
    console.log(`Card ${r + 1} has ${matches} matching cards`);

    // Win next card numbers
    let matchesOnCopied = copyCards.filter(n => n == r).length;
    do {
        for (let c = r; c < r + matches; c++) {
            copyCards.push(c + 1);
        }
    } while (matchesOnCopied-- > 0);

    totalPoints += toPoints(matches);
}

console.log('Round 1:');
console.log(totalPoints);

console.log('Round 2:');
console.log(rows.length + copyCards.length);
