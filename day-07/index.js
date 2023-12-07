'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));

function getHandValue(row, origRow, values) {
    const hand = row.match(/^([AKQJT2-9]){5}/)[0].split('');
    const origHand = origRow.match(/^([AKQJT2-9]){5}/)[0].split('');
    const twoPairs = [];
    const value = {
        totalValue: 0,
        highCard: 0,
        onePair: 0,
        twoPair: 0,
        threeOfKind: 0,
        fullHouse: 0,
        fourOfKind: 0,
        fiveOfKind: 0,
    };

    for (let pos = 0; pos < 5; pos++) {
        value.totalValue += (values[origHand[pos]] << 4 * (4 - pos));
    }

    for (const [card, val] of Object.entries(values)) {
        const sameKind = hand.filter(c => c === card).length;

        if (sameKind === 5 && value.fiveOfKind < val) {
            value.fiveOfKind = val;
        } else if (sameKind === 4 && value.fourOfKind < val) {
            value.fourOfKind = val;
        } else if (sameKind === 3 && value.threeOfKind < val) {
            value.threeOfKind = val;
        } else if (sameKind === 2 && value.onePair < val) {
            value.onePair = val;
        }

        // Two pair
        if (sameKind === 2) {
            twoPairs.push(val);
        }

        // high card
        if (value.highCard < val) {
            value.highCard = val;
        }
    }

    if (twoPairs.length >= 2) {
        value.twoPair = twoPairs.sort((a, b) => b - a).slice(0, 2).reduce((acc, c) => acc + c, 0);
    }

    if (value.onePair > 0 && value.threeOfKind > 0) {
        value.fullHouse = value.onePair + value.threeOfKind;
    }

    // five four full thre two one high
    //    0    0    0    0   0   0  000
    value.calculated = value.highCard
        + ((value.onePair > 0 ? 1 : 0) << 3)
        + ((value.twoPair > 0 ? 1 : 0) << 4)
        + ((value.threeOfKind > 0 ? 1 : 0) << 5)
        + ((value.fullHouse > 0 ? 1 : 0) << 6)
        + ((value.fourOfKind > 0 ? 1 : 0) << 7)
        + ((value.fiveOfKind > 0 ? 1 : 0) << 8);

    // console.log(`${value.calculated.toString(2)} = ${value.calculated} (${row}) ${JSON.stringify(value)}`);

    return value;
}

// Round 1
const values1 = {
    '2': 0x2,
    '3': 0x3,
    '4': 0x4,
    '5': 0x5,
    '6': 0x6,
    '7': 0x7,
    '8': 0x8,
    '9': 0x9,
    'T': 0xA,
    'J': 0xB,
    'Q': 0xC,
    'K': 0xD,
    'A': 0xE,
};

const rows1 = text.split('\n')
    .sort((a, b) => {
        const cA = getHandValue(a, a, values1);
        const cB = getHandValue(b, b, values1);

        if (cA.calculated === cB.calculated) {
            return cA.totalValue - cB.totalValue;
        } else {
            return cA.calculated - cB.calculated;
        }
    });

let result1 = 0;
for (let i = 0; i < rows1.length; i++) {
    result1 += parseInt(rows1[i].substring(6)) * (i + 1);
}

console.log('Round 1:');
console.log(result1);

// Round 2
const values2 = {
    'J': 0x1,
    '2': 0x2,
    '3': 0x3,
    '4': 0x4,
    '5': 0x5,
    '6': 0x6,
    '7': 0x7,
    '8': 0x8,
    '9': 0x9,
    'T': 0xA,
    'Q': 0xC,
    'K': 0xD,
    'A': 0xE,
};

function getHighestScore(row, values) {
    let highscore = getHandValue(row, row, values);
    for (const joker of ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']) {
        const newRow = row.replaceAll('J', joker);
        const score = getHandValue(newRow, row, values);
        if (score.calculated > highscore.calculated) {
            highscore = score;
        }
    }

    return highscore;
}

const rows2 = text.split('\n')
    .sort((a, b) => {
        const cA = getHighestScore(a, values2);
        const cB = getHighestScore(b, values2);

        if (cA.calculated === cB.calculated) {
            return cA.totalValue - cB.totalValue;
        } else {
            return cA.calculated - cB.calculated;
        }
    });

let result2 = 0;
for (let i = 0; i < rows2.length; i++) {
    result2 += parseInt(rows2[i].substring(6)) * (i + 1);
}

console.log('Round 2:');
console.log(result2);
