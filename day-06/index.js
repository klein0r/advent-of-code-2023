'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));
const rows = text.split('\n');

const times = rows[0].split(/(?:,| )+/).map(n => parseInt(n)).filter(n => !isNaN(n));
const distances = rows[1].split(/(?:,| )+/).map(n => parseInt(n)).filter(n => !isNaN(n));

const races = [];

for (let i = 0; i < times.length; i++) {
    races.push({
        t: times[i],
        d: distances[i],
    });
}

const wayToWin = [];

for (const race of races) {
    let wins = 0;
    // calculate winning times
    for (let pushTime = race.t; pushTime > 0; pushTime--) {
        const raceDistance = (race.t - pushTime) * pushTime;

        if (raceDistance > race.d) {
            // console.log(`push ${pushTime} ms to win with ${raceDistance} millimeters`);
            wins++;
        }
    }

    wayToWin.push(wins);
}

console.log('Round 1:');
console.log(wayToWin.reduce((acc, c) => acc * c, 1));

// Round 2
const raceT = parseInt(rows[0].replace(/[^0-9]/g, ''));
const raceD = parseInt(rows[1].replace(/[^0-9]/g, ''));

let wins = 0;
for (let pushTime = raceT; pushTime > 0; pushTime--) {
    const raceDistance = (raceT - pushTime) * pushTime;

    if (raceDistance > raceD) {
        // console.log(`push ${pushTime} ms to win with ${raceDistance} millimeters`);
        wins++;
    }
}

console.log('Round 2:');
console.log(wins);
