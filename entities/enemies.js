global.Enemy = class extends Tank {
    constructor () {
        super();
        this.className = 'twin';
        this.reloadDelay = 1000; // default
        this.color = 'purple';
        this.x = Math.random() > .5 ? random(-30, 0) : random(600, 630);
        this.y = Math.random() > .5 ? random(-30, 0) : random(600, 630);
    }
    get closestPlayer () {
        let distances = [];
        let ids = [];
        for (let i in players) {
            if (players[i].dead) continue;
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
        if (!this.cell || this.cell.dead)
            this.cell = this.closestPlayer;
        if (!this.cell || this.cell.dead) {
            if (this.x > 600/2-100 && this.x < 600/2+100
                && this.y > 600/2-100 && this.y < 600/2+100)
            {
                this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
                return;
            }
            let x, y;
            if (this.x < 300) x = this.x - 250;
            else x = this.x - 350;

            if (this.y < 300) y = this.y - 250;
            else y = this.y - 350;

            this.angle = -Math.atan2(y, -x);
        }
        else {
            let distanceX = this.x - this.cell.x;
            let distanceY = this.y - this.cell.y;
            if (Math.abs(distanceX) > 150 || Math.abs(distanceY) > 150) {
                if (this.x > 600/2-100 && this.x < 600/2+100
                    && this.y > 600/2-100 && this.y < 600/2+100)
                {
                    this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
                    return;
                }
                let x, y;
                if (this.x < 300) x = this.x - 250;
                else x = this.x - 350;
                
                if (this.y < 300) y = this.y - 250;
                else y = this.y - 350;

                this.angle = -Math.atan2(y, -x);
                // this.angle = -Math.atan2(this.y - 300, -(this.x - 300));
            }
            else this.angle = -Math.atan2(distanceY, -distanceX);
        }
        let vx = Math.cos(this.angle)*1.5;
        let vy = Math.sin(this.angle)*1.5;
        this.x += ~~vx|0;
        this.y += ~~vy|0;
    }
    
}

module.exports = function (t) {
    if (!enemies.length) return;
    for (let j = 0; j < enemies.length; j++) {
        let enemy = enemies[j];
        if (!enemy) return;
        // if (isNight) {            
            Enemy.prototype.attack.call(enemy);
            // ? fix ↑
            collision.bulletCollision(enemy, players);
            collision.bodyCollision(enemy, players);
            if (enemy.health < enemy.maxHealth) {
                regen(enemy);
            }
        // }
        if (enemy.lastShootTime + enemy.reloadDelay < now) {
            enemy.shoot();
            // for (let n = 0, len = enemy.guns.length; n < len; n++) {
            //     let i = enemy.guns;
            //     let angle = enemy.angle + i.angle;
            //     let speedX = Math.cos(angle) * enemy.bulletSpeed + Math.random() - .5;
            //     let speedY = Math.sin(angle) * enemy.bulletSpeed + Math.random() - .5;
            //     enemy.bullets.push({
            //         lifeEnd: now + enemy.bulletLifeTime,
            //         health: enemy.penetration,
            //         speedX: +speedX.toFixed(2),
            //         speedY: +speedY.toFixed(2),
            //         x: +(enemy.x + i.x + speedX*3).toFixed(2),
            //         y: +(enemy.y + i.y + speedY*3).toFixed(2)
            //     });
            // }
            enemy.lastShootTime = now;
        }
        if (enemy.bullets.length) {
            for (let n = 0, len = enemy.bullets.length; n < len; n++) {
                let bullet = enemy.bullets[n];
                if (bullet.aliveUntil < now) {
                    enemy.bullets.splice(n, 1);
                    len--;
                    continue;
                }
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            }
        }
    }
}