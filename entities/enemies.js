module.exports = function (t) {
    if (!enemies.length) return;
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
                    enemies[j].bullets.splice(n, 1);
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
    }
}