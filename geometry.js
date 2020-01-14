let random = (min, max) => ~~(Math.random() * (max - min) + min);

module.exports = class Geometry {
    constructor (type) {
        this.w = 15;
        this.h = 15;
        if (type === 'attacker') {
            this.w = 10;
            this.h = 10;
            this.x = random(this.w+600/2-50, 600/2+50-this.w);
            this.y = random(this.h+600/2-50, 600/2+50-this.h);
            this.defaultX = this.x;
            this.defaultY = this.y;
        }
        else if (type === 'hexagon') {
            this.w = 40;
            this.h = 40;
            this.x = random(this.w+600/2-150, 600/2+150-this.w);
            this.y = random(this.h+600/2-150, 600/2+150-this.h);
        }
        else if (type === 'pentagon') {
            this.w = 25;
            this.h = 25;
            this.x = random(this.w+600/2-150, 600/2+150-this.w);
            this.y = random(this.h+600/2-150, 600/2+150-this.h);
        }
        else {
            this.x = random(this.w, 600-this.w),
            this.y = random(this.h, 600-this.h);
        }
        this.cell = null;
        if (type == 'square') {
            this.maxHealth = 4;
            this.bodyDamage = 1;
        }
        else if (type == 'triangle') {
            this.maxHealth = 13;
            this.bodyDamage = 1.5;
        }
        else if (type == 'attacker') {
            this.maxHealth = 13;
            this.bodyDamage = 1.5;
        }
        else if (type == 'pentagon') {
            this.maxHealth = 65;
            this.bodyDamage = 8;
        }
        else if (type == 'hexagon') {
            this.maxHealth = 42;
            this.bodyDamage = 8.5;
        }
        this.health = this.maxHealth;
        this.lastDamaged = 0;
        this.regeneration = {
            timer: null,
            started: false,
            waiting: false,
            speed: .02,
            delay: 3000,
        }
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.direction = Math.random() > .5 ? 1 : -1;
        this.angle = random(0, 360);
        this.angle = 0;
        this.dead = false;
        this.scale = 1;
    }
    recalculate () {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x <= 0) this.x = 0;
        else if (this.x >= 600) this.x = 600;
        if (this.y <= 0) this.y = 0;
        else if (this.y >= 600) this.y = 600;

        if (this.vx > 0) this.vx-=.2;
        else if (this.vx < 0) this.vx += .2;
        if (this.vy > 0) this.vy-=.2;
        else if (this.vy < 0) this.vy += .2;
        this.angle += .01 * this.direction;
        if (this.angle >= 360) this.angle = 0; 
    }
    attack () {
        if (Object.keys(players).length === 0) return;
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
        if (!player) return;

        this.angle = -Math.atan2(this.y - player.y, -(this.x - player.x));
        let vx = Math.cos(this.angle)*1.5;
        let vy = Math.sin(this.angle)*1.5;
        this.x += ~~vx;
        this.y += ~~vy;
    }
    createCell (type) {
        if (type) 
            return new Geometry(type);
        type = random(0, 11);
        switch (type) {
            case 0: case 1: case 2: case 3:
                type = 'square';
                break;
            case 4:
                type = 'hexagon';
                break;
            case 5: case 6: case 7: case 8:
                type = 'triangle';
                break;
            case 9:
                type = 'attacker';
                break;
            case 10:
                type = 'pentagon';
                break;
        }
        return new Geometry(type);
    }
}