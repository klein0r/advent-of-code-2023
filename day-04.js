'use strict';

const fs = require('node:fs');

const text = String(fs.readFileSync('./day-04.txt'));
let rows = text.split('\n');

// testRows
/*
rows = [
    'Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53',
    'Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19',
    'Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1',
    'Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83',
    'Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36',
    'Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11',
];
*/

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
