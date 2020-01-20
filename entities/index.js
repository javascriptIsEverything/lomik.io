let checkEnemies = require('./enemies');
let checkPlayers = require('./players');
let checkCells = require('./cells');
global.castle = require('./castle');

module.exports = {
    checkEnemies,
    checkPlayers,
    checkCells
}