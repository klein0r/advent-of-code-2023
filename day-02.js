'use strict';

const fs = require('node:fs');

const text = String(fs.readFileSync('./day-02.txt'));
let games = text.split('\n');

// testGames
/*
games = [
    'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
    'Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue',
    'Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red',
    'Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red',
    'Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green',
];
*/

function validGame(rounds) {
    // possible games: 12 red cubes, 13 green cubes, and 14 blue cubes
    const limits = {
        red: 12,
        green: 13,
        blue: 14,
    };

    for (const round of rounds) {
        for (const [color, value] of Object.entries(round)) {
            if (limits[color] < value) {
                // console.log(`${value} of ${color} exceeded limit ${limits[color]}`);
                return false;
            }
        }
    }

    return true;
}

function getMinumumCubesPower(rounds) {
    const max = {
        red: 0,
        green: 0,
        blue: 0,
    };

    for (const round of rounds) {
        for (const [color, value] of Object.entries(round)) {
            if (max[color] < value) {
                max[color] = value;
            }
        }
    }

    return max.red * max.green * max.blue;
}

const result1 = [];
const result2 = [];

for (const game of games) {
    const matches = game.match(/^Game ([0-9]{1,3}): (.+)$/);
    const no = parseInt(matches[1]);
    const rounds = matches[2].split(';').map(r => {
        const trimmed = r.trim();
        return trimmed.split(',').reduce((acc, round) => {
            const r = round.trim().match(/^([0-9]{1,}) (.+)$/);
            return {...acc, [r[2]]: parseInt(r[1])};
        }, {});
    });

    // from  Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
    // to    1: [{"blue":3,"red":4},{"red":1,"green":2,"blue":6},{"green":2}]
    // console.log(`${no}: ${JSON.stringify(rounds)}`);

    if (validGame(rounds)) {
        result1.push(no);
    }

    result2.push(getMinumumCubesPower(rounds));
}

console.log('Round 1:');
console.log(result1.length);
console.log(result1.reduce((acc, c) => acc + c, 0));

console.log('Round 2:');
console.log(result2.length);
console.log(result2.reduce((acc, c) => acc + c, 0));
