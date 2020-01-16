// require
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let socketio = require('socket.io');
require('./updater');

// global reusable variables and functions
global.random = (min, max) => ~~(Math.random() * (max - min) + min);
global.now = 0;
global.isNight = false;
let clients = {};
global.players = {};
global.cells = [];
global.enemies = [];
let intervalId = null;
global.playersLength = 0;
// send objects to classes
global.Geometry = require('./geometry');
global.collision = require('./collision');
global.Tank = require('./tank');
global.classes = require('./classes');
let entities = require('./entities');
let io = socketio(server);

io.on('connection', sock => {
    clients[sock.id] = sock;
    players[sock.id] = new Tank(
        ~~(Math.random() * 580 + 10),
        ~~(Math.random() * 580 + 10),
        sock.id
    );
    playersLength++;

    // if the first player joined, run loop
    if (playersLength === 1) {
        enemies.map(i => i.color = 'purple');
        cells = [];
        for (let i = 0; i < 20; i++) {
            cells.push(Geometry.prototype.createCell());
        }
        let t = 0;
        // setInterval(() => {
        //     isNight = !isNight;
        //     if (enemies.length > 3) return;
        //     for (let i = 0; i < 1; i++) {
        //         enemies.push(new Tank(
        //             ~~(Math.random() * 580 + 10),
        //             ~~(Math.random() * 580 + 10),
        //             i // id
        //         ));
        //     }
        // }, 30000);
        enemies.push(new Enemy());
        intervalId = setInterval(() => {
            now = Date.now();
            // gets lightweight variant of players object, so you can update it easier
            let updatedPlayers = entities.checkPlayers();
            // enemies
            entities.checkEnemies(t);
            entities.checkCells();

            io.emit('update', {objects: {
                players: updatedPlayers,
                cells, enemies, isNight
            }});
        }, 1000/60);
    }
    // console.log(`${sock.id} connected!`);

    sock.on('disconnect', function () {
        // console.log(`${sock.id} disconnect!`);
    
        delete clients[sock.id];
        delete players[sock.id];
        playersLength--;
        if (playersLength === 0) {
            clearInterval(intervalId);
            cells = [];
            enemies = [];
        }
    });

    sock.on('rotate', function (obj) {
        let player = players[sock.id];
        if (!player || !obj) return;
        player.angle = obj.angle|0;
        // io.emit('update', {id: sock.id, property: 'angle', value: obj.angle});
    });

    sock.on('score', function () {
        let player = players[sock.id];
        if (!player) return;
        player.score += 1000;
        player.level++;
        updateLevel(player);
        updateScore(player);
    });

    sock.on('changeTank', function (n) {
        let player = players[sock.id];
        if (!player) return;
        classes.call(player, player.availableClasses[n].className, player);
        updateLevel(player);
    });

    sock.on('upgrade', function (key) {
        let player = players[sock.id];
        if (!player) return;

        player.upgrade(player, key);
    });

    sock.on('shoot', function () {
        let player = players[sock.id];
        if (!player.canShoot) return;
        player.shoot();
    });

    sock.on('update', function (obj) {
        if (!players[obj.id]) return;
        if (!obj.property && !obj.props) {
            players[obj.id] = obj.player;
        }
        else {
            let updatedPlayer = players[obj.id];
            
            if (typeof obj.property === 'string')
                updatedPlayer[obj.property] = obj.value;
            else if (obj.props) {
                let props = obj.props;
                // [index: i, [[path to property], value]: prop]
                for (let i = 0; i < props.length; i++) {
                    let arr = props[i]; // [prop, value]
                    let property = arr[0]; // prop
                    

                    if (property instanceof Array) {
                        let path = updatedPlayer[property[0]], last, len = property.length;

                        for (let j = 0; j < len; j++) {
                            if (j == len -1 && j > 0) {
                                last = property[j];
                                break;
                            }
                            path = path[property[j]];
                        }
        
                        path[last] = arr[1]; // value
                    }
                    else updatedPlayer[property] = arr[1];

                }
            }
            else if (obj.property instanceof Array) {
                let path = players[obj.id], last, len = obj.property.length;
                for (let i = 0; i < len; i++) {
                    if (i == len -1 && i > 0) {
                        last = obj.property[i];
                        break;
                    }
                    path = path[obj.property[i]];
                }

                path[last] = obj.value;
            }
            else updatedPlayer[obj.property] = obj.value;
        }
        io.emit('update', obj);
    });
});
    
app.use(express.static(__dirname+'/client'));
server.listen(8080, () => {
    console.log('Lomik.io running at 8080.');
    console.log('sarkel dxyaki kyanqer0. Collision fayli mej sarkel taza stugox fukncia, vor0 kancni twnamineri patronneri vrayov. Hin funkciain cer ttal9');
});
