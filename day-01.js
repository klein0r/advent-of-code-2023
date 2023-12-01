'use strict';

const fs = require('node:fs');

const text = String(fs.readFileSync('./day-01.txt'));
let values = text.split('\n');

// testValues
/*
values = [
    'two1nine',
    'eightwothree',
    'abcone2threexyz',
    'xtwone3four',
    '4nineeightseven2',
    'zoneight234',
    '7pqrstsixteen',
];
*/

const result = [];

for (const val of values) {
    const replacements = val
        .replaceAll('one', 'one1one')
        .replaceAll('two', 'two2two')
        .replaceAll('three', 'three3three')
        .replaceAll('four', 'four4four')
        .replaceAll('five', 'five5five')
        .replaceAll('six', 'six6six')
        .replaceAll('seven', 'seven7seven')
        .replaceAll('eight', 'eight8eight')
        .replaceAll('nine', 'nine9nine')

    const justNumbers = replacements.replace(/[^0-9]/g, '');

    let res = undefined;

    if (justNumbers.length == 1) {
        res = parseInt(`${justNumbers}${justNumbers}`);
    } else if (justNumbers.length == 2) {
        res = parseInt(justNumbers);
    } else if (justNumbers.length > 2) {
        res = parseInt(`${justNumbers.charAt(0)}${justNumbers.charAt(justNumbers.length - 1)}`);
    } else {
        console.error(`Problem with value ${val}`);
    }

    if (res !== undefined) {
        result.push(res);
        console.log(`${val} => ${replacements} => ${justNumbers} => ${res}`);
    }
}

console.log(result.length);
console.log(result.reduce((acc, c) => acc + c, 0));
