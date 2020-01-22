// require
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let socketio = require('socket.io');
require('./updater');
require('./globals');

// global reusable variables and functions
let intervalId = null;
let nightInterval = null;
let isGameOver = false;

let entities = require('./entities');
global.io = socketio(server);
let reset = () => {
    isNight = false;
    castle = new Castle();
    isGameOver = false;
    for (let i in players) {
        if (!players[i]) return;
        clients[i] = false;
        players[i] = new Tank(i);
    }
    cells = [];
    enemies = [];
    for (let i = 0; i < 20; i++) {
        cells.push(Geometry.prototype.createCell());
    }
    nightInterval = setInterval(() => {
        isNight = !isNight;
        if (!isNight) return; 
        if (enemies.length > 5) return;
            
        for (let i = 0; i < playersLength; i++) {
            let enemyClass;
            switch (random(0, 10)) {
                case 1:
                case 2:
                    enemyClass = 'machineGun';
                    break;
                case 3:
                case 4:
                    enemyClass = 'machineGun';
                    break;
                case 5:
                case 6:
                    enemyClass = 'flankguard';
                    break
                case 7:
                case 8:
                    enemyClass = 'sniper';
                    break;
                case 9:
                    enemyClass = 'quadTank';
                    break;
                case 10:
                    enemyCLass = 'pentashot';
                    break;
            }
            let enemy = new Enemy();
            // if (n <= 4) {
            //     enemyClass = 'sniper';
            // }else if (n >= 4 && n <= 6) {
            //     enemyClass = 'flankguard';
            // }else if (n >= 6 && n <= 8) {
            //     enemyClass = 'twin';
            // }else if (n >= 8 && n <= 10) {
            //     enemyClass = 'machineGun';
            // }
            classes.call(enemy, enemyClass ,enemy);
            enemy.reloadDelay *= 1.5;
            enemies.push(enemy);
        }
        for (let i = 0; i < playersLength*3; i++) {
            cells.push(Geometry.prototype.createCell('attacker'));
        }
    }, 10e3);
    castle.aliveFrom = Date.now();
    castle.dead = false;
};

io.on('connection', sock => {
    players[sock.id] = new Tank(sock.id);
    clients[sock.id] = false;
    playersLength++;

    // if the first player joined, run loop
    if (playersLength === 1) {
        reset();
        // enemies.push(new Enemy());
        let opacity = 0;
        let newGameIn = 0;
        intervalId = setInterval(() => {
            now = Date.now();
            if (isGameOver) {
                io.emit('update', {objects: {
                    seconds: ~~((newGameIn - now)/1000)
                }});
                return;
            };
            // gets lightweight variant of players object, so you can update it faster
            let updatedPlayers;
            try { // navsyaki, or awibka tta serv0
                updatedPlayers = entities.checkPlayers();
                // enemies
                entities.checkEnemies();
                entities.checkCells();
                collision.castleCollision();
                if (castle.health <= 0) {
                    castle.lastedUntill = now;
                    newGameIn = now+1e4;
                    // clearInterval(intervalId);
                    clearInterval(nightInterval);
                    isGameOver = true;
                    setTimeout(reset, 1e4);
                }
                regen(castle);

                if (!isNight) opacity -= .6 / 5 / 60;
                else opacity += .6 / 5 / 60;
                if (opacity > .6) opacity = .6;
                else if (opacity < 0) opacity = 0;

                io.emit('update', {objects: {
                    players: updatedPlayers,
                    cells, enemies, isNight, castle, opacity
                }});
            }
            catch (err) {
                console.log(err);
            }
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
            clearInterval(nightInterval);
            cells = [];
            enemies = [];
        }
    });

    sock.on('rotate', function (obj) {
        let player = players[sock.id];
        if (!player || !obj) return;
        player.angle = obj.angle|0;
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
});
