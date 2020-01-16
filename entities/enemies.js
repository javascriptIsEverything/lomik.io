global.Enemy = class extends Tank {
    constructor () {
        super();
        this.className = 'twin';
        classes.call(this, 'sniper', this);
        this.reloadDelay += 1000;
        this.color = 'purple';
        this.x = Math.random() > .5 ? random(-30, 0) : random(600, 630);
        this.y = Math.random() > .5 ? random(-30, 0) : random(600, 630);
    }
    get closestPlayer () {
        let distances = [];
        let ids = [];
        for (let i in players) {
            // players[i];
            let dist = Math.sqrt((this.x-players[i].x)**2 + (this.y-players[i].y)**2);
            distances.push(dist)
            ids.push(players[i].id);
        }
        let closest = Math.min(...distances);
        if (closest > 300) {
            if (this.x == this.defaultX && this.y == this.defaultY) return;
            this.angle = -Math.atan2(this.y - this.defaultY, -(this.x - this.defaultX));
            let vx = Math.cos(this.angle)*1.5;
            let vy = Math.sin(this.angle)*1.5;
            this.x += ~~vx;
            this.y += ~~vy;
            return;
        };
        let index = distances.indexOf(closest);
        let player = players[ids[index]];
        if (!player) return null;
        return player;
    }
    attack () {
        if (!this.cell) this.cell = this.closestPlayer;
        if (!this.cell) {
            this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
        }
        else {
            let distanceX = this.x - this.cell.x;
            let distanceY = this.y - this.cell.y;
            if (Math.abs(distanceX) > 150 || Math.abs(distanceY) > 150)
            this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
            else this.angle = -Math.atan2(distanceY, -distanceX);
        }
        let vx = Math.cos(this.angle)*1.5;
        let vy = Math.sin(this.angle)*1.5;
        this.x += ~~vx;
        this.y += ~~vy;
    }
    
}

module.exports = function (t) {
    if (!enemies.length) return;
    for (let j = 0; j < enemies.length; j++) {
        // if (isNight) {            
            enemies[j].attack();
            collision.bulletCollision(enemies[j], players);
            collision.bodyCollision(enemies[j], players);
        // }
        if (enemies[j].lastShootTime + enemies[j].reloadDelay < now) {
            enemies[j].shoot();
            // for (let n = 0, len = enemies[j].guns.length; n < len; n++) {
            //     let i = enemies[j].guns;
            //     let angle = enemies[j].angle + i.angle;
            //     let speedX = Math.cos(angle) * enemies[j].bulletSpeed + Math.random() - .5;
            //     let speedY = Math.sin(angle) * enemies[j].bulletSpeed + Math.random() - .5;
            //     enemies[j].bullets.push({
            //         lifeEnd: now + enemies[j].bulletLifeTime,
            //         health: enemies[j].penetration,
            //         speedX: +speedX.toFixed(2),
            //         speedY: +speedY.toFixed(2),
            //         x: +(enemies[j].x + i.x + speedX*3).toFixed(2),
            //         y: +(enemies[j].y + i.y + speedY*3).toFixed(2)
            //     });
            // }
            enemies[j].lastShootTime = now;
        }
        if (enemies[j].bullets.length) {
            for (let n = 0, len = enemies[j].bullets.length; n < len; n++) {
                let bullet = enemies[j].bullets[n];
                if (bullet.aliveUntil < now) {
                    enemies[j].bullets.splice(n, 1);
                    len--;
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
    }
}