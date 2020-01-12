// require
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let socketio = require('socket.io');

// global reusable variables and functions
let now = 0;
let isNight = true;
let clients = {};
let players = {};
let cells = [];
let enemies = [];
let intervalId = null;
let playersLength = 0;
// send objects to classes
let Geometry = require('./geometry')(players, cells);
let collision = require('./collision')(Geometry);
let Tank = require('./tank');
let helper = require('./updater/helper');
let classes = require('./classes');
let move = helper.move;
let isOutOfBox = helper.isOutOfBox;
let updateLevel = helper.updateLevel;
let regen = helper.regen;
let random = (min, max) => ~~(Math.random() * (max - min) + min);
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
        setInterval(() => {
            isNight = !isNight;
            if (enemies.length > 3) return;
            for (let i = 0; i < 1; i++) {
                enemies.push(new Tank(
                    ~~(Math.random() * 580 + 10),
                    ~~(Math.random() * 580 + 10),
                    i // id
                ));
            }
        }, 30000);
        intervalId = setInterval(() => {
            let updatedPlayers = {};
            now = Date.now();
            for (let i in players) {
                let player = players[i];
                let level = player.level;
                collision.bulletCollision(player, cells);
                collision.bodyCollision(player, cells);
                if (level < player.level)
                    updateLevel(player);

                if (player.health < player.maxHealth) {
                    regen(player, now);
                }

                if (player.buttons.c === true)
                    player.angle += .02;

                if (player.bullets.length) {
                    let bullets = player.bullets;
                    let len = bullets.length;

                    for (let i = 0; i < len; i++) {
                        let bullet = bullets[i];
                        if (bullet.aliveUntil < now) {
                            bullets.splice(i, 1);
                            len--;
                            continue;
                        }
                        bullet.x += bullet.speedX;
                        bullet.y += bullet.speedY;
                        isOutOfBox(player);
                    }
                }
                move(player);
                updatedPlayers[player.id] = player.simplify;
            }
            // enemies
            for (let j = 0; j < enemies.length; j++) {
                if (isNight)
                    Geometry.prototype.attack.call(enemies[j]);
                if (t + 2000 < now) {
                    for (let n = 0, len = enemies[j].guns.length; n < len; n++) {
                        let i = enemies[j].guns;
                        let speedX = Math.cos(enemies[j].angle + i.angle) * enemies[j].bulletSpeed + Math.random() - .5;
                        let speedY = Math.sin(enemies[j].angle + i.angle) * enemies[j].bulletSpeed + Math.random() - .5;
                        enemies[j].bullets.push({
                            lifeEnd: now + enemies[j].bulletLifeTime,
                            health: enemies[j].penetration,
                            speedX: +speedX.toFixed(2),
                            speedY: +speedY.toFixed(2),
                            x: +(enemies[j].x + i.x + speedX*3).toFixed(2),
                            y: +(enemies[j].y + i.y + speedY*3).toFixed(2)
                        });
                    }
                    t = now;
                }
                if (enemies[j].bullets.length) {
                    for (let n = 0, len = enemies[j].bullets.length; n < len; n++) {
                        let bullet = enemies[j].bullets;
                        if (bullet.aliveUntil < now) {
                            enemies[0].bullets.splice(n, 1);
                            continue;
                        }
                        bullet.x += bullet.speedX;
                        bullet.y += bullet.speedY;
                    }
                }
            }
            for (let j = 0, len = cells.length; j < len; j++) {
                let i = cells[j];
                if (i.dead) {
                    i.scale += .1;
                    if (i.scale >= 2)
                        cells.splice(j, 1);
                        len--;
                    continue;
                }
                else if (i.type == 'attacker') {
                    i.attack();
                }
                if (i.health < i.maxHealth) {
                    regen(i, now);
                }
                i.recalculate();
            }
            io.emit('update', {objects: {players: updatedPlayers, cells, enemies, isNight}});
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
        }
    });

    sock.on('rotate', function (obj) {
        let player = players[sock.id];
        if (!player || !obj) return;
        player.angle = obj.angle;
        // io.emit('update', {id: sock.id, property: 'angle', value: obj.angle});
    });

    sock.on('changeTank', function (n) {
        let player = players[sock.id];
        if (!player) return;
        classes.call(player, player.availableClasses[n].className);
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
        let guns = player.guns;

        for (let j = 0, len = guns.length; j < len; j++) {
            let i = guns[j];
            let speedX = Math.cos(player.angle + i.angle) * player.bulletSpeed + random(player.spread[0], player.spread[1]);
            let speedY = Math.sin(player.angle + i.angle) * player.bulletSpeed + random(player.spread[0], player.spread[1]);
            player.bullets.push({
                aliveUntil: now + player.bulletLifeTime,
                health: player.penetration,
                speedX: +speedX.toFixed(2),
                speedY: +speedY.toFixed(2),
                x: +(player.x + i.x + speedX*3).toFixed(2),
                y: +(player.y + i.y + speedY*3).toFixed(2)
            });
        }
        player.canShoot = false;
        player.x -= Math.cos(player.angle)/.3;
        player.y -= Math.sin(player.angle)/.3;

        setTimeout(() => player.canShoot = true, player.reloadDelay);
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
server.listen(8080, () => console.log('Lomik.io running at 8080.'))