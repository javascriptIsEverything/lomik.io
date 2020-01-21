module.exports = function () {
    let updatedPlayers = {};
    for (let i in players) {
        let player = players[i];
        if (clients[i]) return;
        if (!player || player.dead) return;
        let level = player.level;
        collision.bulletCollision(player, cells);
        collision.bodyCollision(player, cells);
        if (level < player.level)
            updateLevel(player);
    
        if (player.health < player.maxHealth) {
            if (player.health > 0)
                regen(player);
            else {
                io.emit('update', {objects: {
                    seconds: now + 1e4
                }});
                setTimeout(() => players[i] = new Tank(i), 1e4);
            }
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
    return updatedPlayers;
}