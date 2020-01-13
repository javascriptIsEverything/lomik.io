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
                sc = 10;
            for (let i = 0; i < 45; i++) {
                arr.push(sc);
                sc = ~~(sc * 1.2);
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
        this.bulletR = 5;
    }
    moveHandler(obj = this, e) {
        if (!obj.moveButtons) return;

        let isKeydown;
        if (e.type == 'keydown') isKeydown = true;
        else if (e.type == 'keyup') isKeydown = false;

        switch (e.keyCode) {
            case 39:
            case 68:
                obj.moveButtons.right = isKeydown;
                break;
            case 37:
            case 65:
                obj.moveButtons.left = isKeydown;
                break;
            case 38:
            case 87:
                obj.moveButtons.up = isKeydown;
                break;
            case 40:
            case 83:
                obj.moveButtons.down = isKeydown;
                break;
            default:
                return;
        }

        obj.isMoving = true;

        if (!isKeydown) {
            let isAnyKeyPressed;
            for (let i in obj.moveButtons) {
                if (obj.moveButtons[i] === true)
                    isAnyKeyPressed = true;
            }
            // console.log(isAnyKeyPressed);
            if (!isAnyKeyPressed)
                obj.isMoving = false;
        }
        sock.emit('update', {
            id: sock.id,
            props: [
                ['moveButtons', obj.moveButtons],
                ['isMoving', obj.isMoving]
            ]
        })

        // let props = new Map();
        // props.set('isMoving', obj.isMoving);
        // props.set('moveButtons', obj.moveButtons);

        // sock.emit('update', {id: sock.id, props: props});
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
            obj.upgradedNTimes[8] -= 1;
            return true;
        }
    }
    drawScoreAndUpdates() {
        // this.upgradedNTimes[8] = 1;
        // score
        let nextLvL = this.levelSettings[this.level + 1];
        let earnedNow = this.score - this.prevLevelsTotal;
        let percent = earnedNow * 100 / nextLvL;

        let width = 120;
        let height = 12;
        let text;

        ctx.fillStyle = '#000';
        ctx.fillRect(cw / 2 - width / 2, ch - 30, width, height);
        ctx.fillStyle = 'orangered';
        ctx.fillRect(cw / 2 - width / 2 + 1, ch - 28, percent * (width - 4) / 100, height - 4);

        ctx.fillStyle = '#fff'
        ctx.font = "10px serif";
        text = `Score: ${this.score}`;
        ctx.fillText(text, cw / 2 - text.length * 2, ch - 20.5);

        width = 130;

        ctx.fillStyle = '#000';
        ctx.fillRect(cw / 2 - width / 2, ch - 45, width, height);
        ctx.fillStyle = 'dodgerblue';
        ctx.fillRect(cw / 2 - width / 2 + 1, ch - 43,
            (this.level * 100 / this.levelSettings.length) * (width - 4) / 100,
            height - 4);

        ctx.fillStyle = '#fff'
        ctx.font = "10px serif";
        text = `Level: ${this.level}`;
        ctx.fillText(text, cw / 2 - text.length * 2, ch - 36.5);
        // score end

        // upgrades
        // if (this.upgradedNTimes[8] <= 0) return;

        let x = 20,
            y = ch - 130,
            w = 150,
            h = 10,
            u = this.upgradedNTimes;
        ctx.fillStyle = '#000';
        ctx.save();
        ctx.translate(x + w + 3, y + 5);
        ctx.rotate(5.9);
        ctx.font = '20px sans-serif';
        ctx.fillText(`x${u[8]}`, 0, 0);
        ctx.restore();
        for (let i in u) {
            if (i == u.length - 1) break;

            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, w, h);
            // upgrade color
            switch (i | 0) {
                case 0:
                    ctx.fillStyle = 'rgb(237, 181, 143)';
                    break;
                case 1:
                    ctx.fillStyle = 'rgb(235, 107, 239)';
                    break;
                case 2:
                    ctx.fillStyle = 'rgb(154, 108, 240)';
                    break;
                case 3:
                    ctx.fillStyle = 'rgb(107, 149, 239)';
                    break;
                case 4:
                    ctx.fillStyle = 'rgb(240, 217, 108)';
                    break;
                case 5:
                    ctx.fillStyle = 'rgb(240, 108, 108)';
                    break;
                case 6:
                    ctx.fillStyle = 'rgb(151, 239, 107)';
                    break;
                case 7:
                    ctx.fillStyle = 'rgb(108, 240, 236)';
                    break;
                default:
                    ctx.fillStyle = 'white';
                    break;
            }
            ctx.fillRect(x, y + 1, (u[i] * 100 / 7) * (w - 2) / 100, h - 2)
            
            let mx = x;
            ctx.fillStyle = '#000';
            let mw = w / 7;
            for (let j = 0; j < 7; j++) {
                ctx.strokeRect(mx, y, mw - 1, h - 1);
                mx += mw;
            }
            y += 15;
        }

    }
    keyHandler(obj = this, e) {
        switch (e.keyCode) {
            case 67:
            case 99:
                obj.buttons.c = !obj.buttons.c;
                sock.emit('update', {
                    id: sock.id,
                    property: ['buttons', 'c'],
                    value: obj.buttons.c
                });
                break;
            case 69:
            case 101:
                obj.buttons.e = !obj.buttons.e;
                sock.emit('update', {
                    id: sock.id,
                    property: ['buttons', 'e'],
                    value: obj.buttons.e
                });
                break;
        }
        // [1..8]
        if (e.keyCode >= 49 && e.keyCode < 57) {
            Tank.prototype.upgrade(obj, e.key | 0);
        }
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