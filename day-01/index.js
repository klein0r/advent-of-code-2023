'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));
const rows = text.split('\n');

function firstAndLastDigit(val) {
    if (val.length == 1) {
        return parseInt(`${val}${val}`);
    } else if (val.length == 2) {
        return parseInt(val);
    } else if (val.length > 2) {
        return parseInt(`${val.charAt(0)}${val.charAt(val.length - 1)}`);
    } else {
        console.error(`Problem with value ${val}`);
        return undefined;
    }
}

const result1 = [];
const result2 = [];

for (const row of rows) {
    const replacements = row
        .replaceAll('one', 'one1one')
        .replaceAll('two', 'two2two')
        .replaceAll('three', 'three3three')
        .replaceAll('four', 'four4four')
        .replaceAll('five', 'five5five')
        .replaceAll('six', 'six6six')
        .replaceAll('seven', 'seven7seven')
        .replaceAll('eight', 'eight8eight')
        .replaceAll('nine', 'nine9nine')

    const res1 = firstAndLastDigit(row.replace(/[^0-9]/g, ''));
    if (res1 !== undefined) {
        result1.push(res1);
        // console.log(`${row} => ${replacements} => ${justNumbers} => ${res}`);
    }

    const res2 = firstAndLastDigit(replacements.replace(/[^0-9]/g, ''));
    if (res2 !== undefined) {
        result2.push(res2);
        // console.log(`${row} => ${replacements} => ${justNumbers} => ${res}`);
    }
}

console.log('Round 1:');
console.log(result1.reduce((acc, c) => acc + c, 0));

console.log('Round 2:');
console.log(result2.reduce((acc, c) => acc + c, 0));
