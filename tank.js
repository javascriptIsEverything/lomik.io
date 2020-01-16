module.exports = class Tank {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.r = 10;
        this.id = id;
        this.className = 'default';
        this.color = 'dodgerblue';
        this.upgradedNTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.classPath = [];
        this.availableClasses = {};
        this.speed = 2;
        this.bulletSpeed = 5;
        this.spread = [-.5, .5];
        this.dead = false;
        this.maxHealth = 18;
        this.health = this.maxHealth;
        this.levelSettings = (() => {
            let arr = [0],
                sc = 5;
            for (let i = 0; i < 45; i++) {
                arr.push(sc);
                sc = Math.ceil(sc * 1.1);
            }
            return arr;
        })();
        this.level = 1;
        this.prevLevelsTotal = 0;
        this.score = 0;
        this.buttons = {
            c: false,
            e: false
        };
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            r: 5,
            width: 30,
            height: 8,
            angle: 0
        }];
        // randomator
        // this.guns = (() => {
        //     let arr = []
        //     for (let i = 0; i < 360; i+=10) {
        //         arr.push({
        //             x: 0,
        //             y: -this.r/2,
        //             width: 30,
        //             height: 8,
        //             angle: ~~(Math.random() * (360 - 0) + 0)
        //         })
        //     }
        //     return arr;
        // })();
        this.angle = 0;
        this.bodyDamage = 7;
        this.bulletDamage = 3;
        this.penetration = 0;
        this.bulletLifeTime = 1000;
        this.reloadDelay = 500;
        this.canShoot = true;
        this.bullets = [];
        this.lastShootTime = 0;
        this.isMoving = false;
        this.moveButtons = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.lastDamaged = 0;
        this.regeneration = {
            timer: null,
            started: false,
            waiting: false,
            speed: .02,
            delay: 3000
        };
    }
    upgrade(obj = this, n) {
        n--;
        if (obj.upgradedNTimes[n] > 6) return false;
        else if (obj.upgradedNTimes[8] <= 0) return false;

        switch (n) {
            case 0:
                obj.regeneration.delay -= 200;
                obj.regeneration.speed += .04;
                break;
            case 1:
                obj.maxHealth += 10;
                break;
            case 2:
                obj.bodyDamage += 8;
                obj.maxHealth += 2;
                break;
            case 3:
                obj.bulletSpeed += .5;
                break;
            case 4:
                // obj.penetration += 2;
                // obj.bulletDamage += 2;
                break;
            case 5:
                obj.bulletDamage += .5;
                break;
            case 6:
                obj.reloadDelay -= 50;
                break;
            case 7:
                obj.speed += .3;
                break;
        }

        if (obj.upgradedNTimes[n] !== undefined) {
            obj.upgradedNTimes[n]++;
            obj.upgradedNTimes[8]--;
            return true;
        }
    }
    shoot () {
        let guns = this.guns;

        for (let j = 0, len = guns.length; j < len; j++) {
            let i = guns[j];
            let angle = this.angle + i.angle;
            let speedX = Math.cos(angle) * this.bulletSpeed + random(this.spread[0], this.spread[1]);
            let speedY = Math.sin(angle) * this.bulletSpeed + random(this.spread[0], this.spread[1]);
            this.bullets.push({
                aliveUntil: now + this.bulletLifeTime,
                health: this.penetration,
                speedX: +speedX.toFixed(2),
                speedY: +speedY.toFixed(2),
                x: +(this.x + i.x + speedX*3).toFixed(2),
                y: +(this.y + i.y + speedY*3).toFixed(2),
                r: i.r
            });
        }
        this.canShoot = false;
        this.x -= Math.cos(this.angle)/.3;
        this.y -= Math.sin(this.angle)/.3;

        setTimeout(() => this.canShoot = true, this.reloadDelay);
    }
    get simplify() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            r: this.r,
            className: this.className,
            classPath: this.classPath,
            canShoot: this.canShoot,
            guns: this.guns,
            bullets: this.bullets,
            moveButtons: this.moveButtons,
            buttons: this.buttons,
            upgradedNTimes: this.upgradedNTimes,
            color: this.color,
            dead: this.dead,
            maxHealth: this.maxHealth,
            health: this.health,
            levelSettings: this.levelSettings,
            level: this.level,
            prevLevelsTotal: this.prevLevelsTotal,
            score: this.score,
            angle: this.angle,
            bulletR: this.bulletR,
            availableClasses: this.availableClasses
        }
    }
}