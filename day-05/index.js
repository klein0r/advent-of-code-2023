'use strict';

const fs = require('node:fs');

const input = process.argv.length > 2 && process.argv[2] === 'ex' ? 'example' : 'input';
const text = String(fs.readFileSync(`./${input}.txt`));

const seeds = text
    .match(/^seeds: ([0-9 ]+)/)[1]
    .split(' ')
    .map(s => parseInt(s));

// console.log(JSON.stringify(seeds));
// console.log(JSON.stringify(moreSeeds));

const maps = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': [],
};

for (const map in maps) {
    const re = new RegExp(`${map} map:\\s+([0-9 \\n]+)`);
    maps[map] = re
        .exec(text)[1]
        .split('\n')
        .filter(str => str.length > 0)
        .map(s => {
            const [ destinationRange, sourceRange, length ] = s.split(' ');
            return {
                destinationRange: parseInt(destinationRange),
                destinationRangeEnd: parseInt(destinationRange) + parseInt(length) - 1,
                sourceRange: parseInt(sourceRange),
                sourceRangeEnd: parseInt(sourceRange) + parseInt(length) - 1,
                length: parseInt(length),
            };
        })
        .sort((a, b) => a.sourceRange - b.sourceRange);
}

// console.log(JSON.stringify(soils, null, 2));

const mapNumRange = (num, inMin, inMax, outMin, outMax) =>
  ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

function getValueOfMapping(type, value) {
    for (const map of maps[type]) {
        if (value >= map.sourceRange && value <= map.sourceRangeEnd) {
            return mapNumRange(value, map.sourceRange, map.sourceRangeEnd, map.destinationRange, map.destinationRangeEnd);
        }
    }

    return value;
}

function seedToLoc(seed) {
    const soil = getValueOfMapping('seed-to-soil', seed);
    const fertilizer = getValueOfMapping('soil-to-fertilizer', soil);
    const water = getValueOfMapping('fertilizer-to-water', fertilizer);
    const light = getValueOfMapping('water-to-light', water);
    const temperature = getValueOfMapping('light-to-temperature', light);
    const humidity = getValueOfMapping('temperature-to-humidity', temperature);
    return getValueOfMapping('humidity-to-location', humidity);
}

const result1 = [];

for (const seed of seeds) {
    result1.push(seedToLoc(seed));
}

console.log('Round 1:');
console.log(Math.min.apply(Math, result1));

// Round 2
const seedMaps = [];

for (let i = 0; i < seeds.length; i += 2) {
    seedMaps.push({
        start: seeds[i],
        end: seeds[i] + seeds[i + 1] - 1,
    });
}

let result2 = Number.MAX_SAFE_INTEGER;

for (const seedMap of seedMaps) {
    for (const seedSoil of maps['seed-to-soil']) {
        const overlap = Math.min(seedMap.end, seedSoil.sourceRangeEnd) - Math.max(seedMap.start, seedSoil.sourceRange);

        if (overlap >= 0) {
            const overLapStart = seedMap.start > seedSoil.sourceRange ? seedMap.start : seedSoil.sourceRange;
            const overLapEnd = seedMap.end < seedSoil.sourceRangeEnd ? seedMap.end : seedSoil.sourceRangeEnd;

            //console.log(`looping from ${overLapStart} to ${overLapEnd} (map ${seedSoil.sourceRange} to ${seedSoil.sourceRangeEnd})`);

            for (let seed = overLapStart; seed <= overLapEnd; seed++) {
                const location = seedToLoc(seed);
                if (location < result2) {
                    //console.log(`min ${seed} @ ${location} (map ${seedSoil.sourceRange} to ${seedSoil.sourceRangeEnd})`);
                    result2 = location;
                }
            }

            break;
        }
    } 
}

/*
// Too slow ...
for (const seedMap of seedMaps) {
    for (let seed = seedMap.start; seed <= seedMap.end; seed++) {
        const location = seedToLoc(seed);
        //console.log(`${seed} has location ${location}`);
        if (location < result2) {
            result2 = location;
        }
    }
}
*/

console.log('Round 2:');
console.log(result2);
