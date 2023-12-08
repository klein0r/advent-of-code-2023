'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));

function getHandTotal(row, values) {
    const hand = row.match(/^([AKQJT2-9]){5}/)[0].split('');

    let totalValue = 0;
    for (let pos = 0; pos < 5; pos++) totalValue += (values.indexOf(hand[pos]) << 4 * (4 - pos));
    return totalValue;
}

function getHandValue(row, values) {
    const hand = row.match(/^([AKQJT2-9]){5}/)[0].split('');
    let high = 0;
    let pairs = 0;

    // five four full thre two one high
    //    0    0    0    0   0   0  000
    let value = 0b000000000;

    for (let i = 0; i < values.length; i++) {
        const sameKind = hand.filter(c => c === values[i]).length;
        if (high < i) high = i;

        if (sameKind === 5) value |= 0b100000000;
        else if (sameKind === 4) value |= 0b010000000;
        else if (sameKind === 3) value |= 0b000100000;
        else if (sameKind === 2) {
            value |= 0b000001000;
            pairs++;
        }
    }

    value |= (0b111 & high);

    if (pairs == 2) value |= 0b000010000;
    if (value.onePair && value.threeOfKind) value |= 0b001000000;

    return value;
}

// Round 1
const values1 = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const rows1 = text.split('\n')
    .sort((a, b) => {
        const vA = getHandValue(a, values1);
        const vB = getHandValue(b, values1);

        if (vA === vB) {
            const tA = getHandTotal(a, values1);
            const tB = getHandTotal(b, values1);

            return tA - tB;
        } else {
            return vA - vB;
        }
    });

let result1 = 0;
for (let i = 0; i < rows1.length; i++) {
    result1 += parseInt(rows1[i].substring(6)) * (i + 1);
}

console.log('Round 1:');
console.log(result1);

// Round 2
const values2 = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'];

function getHighestHandValue(row, values) {
    let highscore = getHandValue(row, values);
    for (const joker of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']) {
        const newRow = row.replaceAll('J', joker);
        const score = getHandValue(newRow, values);
        if (score > highscore) {
            highscore = score;
        }
    }

    return highscore;
}

const rows2 = text.split('\n')
    .sort((a, b) => {
        const vA = getHighestHandValue(a, values2);
        const vB = getHighestHandValue(b, values2);

        if (vA === vB) {
            const tA = getHandTotal(a, values2);
            const tB = getHandTotal(b, values2);

            return tA - tB;
        } else {
            return vA - vB;
        }
    });

let result2 = 0;
for (let i = 0; i < rows2.length; i++) {
    result2 += parseInt(rows2[i].substring(6)) * (i + 1);
}

console.log('Round 2:');
console.log(result2);
