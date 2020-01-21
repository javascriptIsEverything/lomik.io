global.random = (min, max) => ~~(Math.random() * (max - min) + min);
global.now = 0;
global.isNight = false;
global.players = {};
global.clients = [];
global.cells = [];
global.enemies = [];
global.playersLength = 0;
// send objects to classes
global.Geometry = require('./geometry');
global.collision = require('./collision');
global.Tank = require('./tank');
global.classes = require('./classes');