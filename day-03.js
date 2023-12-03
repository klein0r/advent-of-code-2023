'use strict';

const fs = require('node:fs');

const text = String(fs.readFileSync('./day-03.txt'));
let rows = text.split('\n');

/*
Part 1 Sum: 532428
Part 2 Sum: 84051670
*/

// testRows
/*
rows = [
    '467..114..',
    '...*......',
    '..35..633.',
    '......#...',
    '617*......',
    '.....+.58.',
    '..592.....',
    '......755.',
    '...$.*....',
    '.664.598..',
];
*/

function symbolInAreaOfNumber(s, n) {
    return n.area.rows.includes(s.row) && n.area.start <= s.index && n.area.end >= s.index;
}

const nmbrRegex = /\d+/g;
const matchedNumbers = [];

for (let r = 0; r < rows.length; r++) {
    let match = null;
    while ((match = nmbrRegex.exec(rows[r])) != null) {
        const numberIndex = match.index;
        const length = match[0].length;
        console.log(`Number in row ${r + 1} @ position ${numberIndex}: ${match[0]} (${length} digits)`);

        matchedNumbers.push({
            valid: false,
            value: parseInt(match[0]),
            area: {
                row: r,
                rows: [r, r - 1, r + 1].filter(rr => rr >= 0 && rr < rows.length), // valid in rows
                start: numberIndex > 0 ? numberIndex - 1 : numberIndex,
                end: numberIndex + length,
            }
        });
    }
}

/*
...xxxxxx.... 0
...x1234x.... 1
...xxxxxx.... 2
*/

const symbolRexexp = /[^\d.]/g; // no numbers or dots
const matchedSymbols = [];

for (let r = 0; r < rows.length; r++) {
    let match = null;
    while ((match = symbolRexexp.exec(rows[r])) != null) {
        const symbolIndex = match.index;
        console.log(`Symbol in row ${r + 1} @ position ${symbolIndex}: ${match[0]}`);

        matchedSymbols.push({
            value: match[0],
            isGear: match[0] === '*',
            partNumbers: [],
            index: symbolIndex,
            row: r,
        });
    }
}

// Part 1
for (const n of matchedNumbers) {
    for (const s of matchedSymbols) {
        if (symbolInAreaOfNumber(s, n)) {
            console.log(`${n.value} (row ${n.area.row + 1}) is valid by sybol ${s.value} in row ${s.row + 1}`);
            n.valid = true;
        }
    }
}

//console.log(JSON.stringify(matchedNumbers, null, 2));

// Part 2
for (const s of matchedSymbols) {
    for (const n of matchedNumbers) {
        if (s.isGear && symbolInAreaOfNumber(s, n)) {
            s.partNumbers.push(n.value);
        }
    }
}

console.log('Round 1:');
console.log(matchedNumbers.reduce((acc, n) => n.valid ? acc + n.value : acc, 0));

console.log('Round 2:');
console.log(matchedSymbols.reduce((acc, s) => {
    if (s.isGear && s.partNumbers.length === 2) {
        acc += s.partNumbers[0] * s.partNumbers[1];
    }

    return acc;
}, 0));
