let Tank = require('./tank');
let Geometry = require('./geometry')
// let intervalId = null;
let time = 1000/60;
let enemies = [];
for (let i = 0; i < 3; i++) {
    enemies.push(new Tank(
        ~~(Math.random() * 580 + 10),
        ~~(Math.random() * 580 + 10),
        i // id
    ));
}
enemies.map(i => i.color = 'purple');
cells = [];
for (let i = 0; i < 20; i++) {
    cells.push(Geometry.prototype.createCell());
}
let t = 0;
intervalId = setInterval(() => {
    let updatedPlayers = {};
    const now = Date.now();
    for (let i in players) {
        let player = players[i];
        let level = player.level;
        collision.bulletCollision(player, cells);
        collision.bodyCollision(player, cells);
        if (level < player.level)
            updateLevel(player)

        if (player.health < player.maxHealth) {
            if (player.lastDamaged + player.regeneration.delay < now) {
                player.health += player.regeneration.speed;
                if (player.health > player.maxHealth) {
                    player.health = player.maxHealth;
                }
            }
        }

        move(player);
        if (player.buttons.c === true)
            player.angle += .02;

        if (enemies[0].bullets.length) {
            for (let bullet of enemies[0].bullets) {
                if (bullet.aliveUntil < now) {
                    enemies[0].bullets.splice(enemies[0].bullets.indexOf(bullet), 1);
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
        if (player.bullets.length) {
            for (let bullet of player.bullets) {
                if (bullet.aliveUntil < now) {
                    player.bullets.splice(player.bullets.indexOf(bullet), 1);
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
        updatedPlayers[player.id] = player.simplify;
    }
    // enemies
    for (let j = 0; j < enemies.length; j++) {
        Geometry.prototype.attack.call(enemies[j]);
        if (t + 2000 < Date.now()) {
            for (let i of enemies[j].guns) {
                let speedX = Math.cos(enemies[j].angle + i.angle) * enemies[j].bulletSpeed + Math.random() - .5;
                let speedY = Math.sin(enemies[j].angle + i.angle) * enemies[j].bulletSpeed + Math.random() - .5;
                enemies[j].bullets.push({
                    lifeEnd: Date.now() + enemies[j].bulletLifeTime,
                    health: enemies[j].penetration,
                    speedX: +speedX.toFixed(2),
                    speedY: +speedY.toFixed(2),
                    x: +(enemies[j].x + i.x + speedX*3).toFixed(2),
                    y: +(enemies[j].y + i.y + speedY*3).toFixed(2)
                });
                // setTimeout(enemies[0].bullets.shift, enemies[0].bulletLifeTime);
            }
            t = Date.now();
        }
    }
    for (let i of cells) {
        if (i.dead) {
            i.scale += .1;
            if (i.scale >= 2) i.die();
            continue;
        }
        else if (i.type == 'attacker') {
            i.attack();
        }
        if (i.health < i.maxHealth) {
            if (i.lastDamaged + i.regeneration.delay < now) {
                i.health += i.regeneration.speed;
                if (i.health > i.maxHealth) {
                    i.health = i.maxHealth;
                }
            }
        }
        i.recalculate();
    }
    io.emit('update', updatedPlayers);
    io.emit('updateCells', cells);
    io.emit('updateEnemies', enemies);
}, time);