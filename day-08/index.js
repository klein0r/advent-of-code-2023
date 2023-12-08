'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 ? process.argv[2] : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));
const rows = text.split('\n');

const dirs = rows[0].split('');
const nodes = {};

for (let r = 2; r < rows.length; r++) {
    const [ tmp, id, L, R ] = rows[r].match(/([0-9A-Z]{3}) = \(([0-9A-Z]{3}), ([0-9A-Z]{3})/);
    nodes[id] = {L, R};
}

function runsTo(start, endings) {
    let d = 0;
    let pos = start;
    let runs = 0;

    do {
        if (d == dirs.length) d = 0;

        pos = nodes?.[pos]?.[dirs[d++]];
        runs++;
    } while (pos && !endings.includes(pos));

    return runs;
}

// Round 1
console.log('Round 1:');
console.log(runsTo('AAA', ['ZZZ']));

// Round 2
/*
const ghostNodes = Object
    .keys(nodes)
    .filter(n => n.endsWith('A'));

let d = 0;
let runs = 0;
do {
    runs++;

    if (d == dirs.length) d = 0;
    let dir = dirs[d++];

    for (let g = 0; g < ghostNodes.length; g++) {
        const newPos = nodes[ghostNodes[g]][dir];
        if (!newPos) console.error(`${ghostNodes[g]} as no new pos ${dir}`) && process.exit();
        //console.log(`${runs}: ${ghostNodes[g]} moves ${dir} to ${newPos}`);
        ghostNodes[g] = newPos;
    }

    if (runs > 100) {
        //process.exit();
    }
} while (ghostNodes.filter(n => n.endsWith('Z')).length !== ghostNodes.length);
*/

const startNodes = Object.keys(nodes).filter((n) => n.endsWith('A'));
const endNodes = Object.keys(nodes).filter((n) => n.endsWith('Z'));

function leastCommonMultiple(runs) {
    const ggT = (a, b) => (!b ? a : ggT(b, a % b));
    const kgV = (a, b) => (a * b) / ggT(a, b);

    return runs.reduce(
        (multiple, num) => kgV(multiple, num),
        Math.min(...runs) // start with min values
    );
}

const runsToEnd = startNodes.map((n) => runsTo(n, endNodes));
const result2 = leastCommonMultiple(runsToEnd);

console.log('Round 2:');
console.log(result2);
