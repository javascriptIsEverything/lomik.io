function RectCircleColliding(circle, rect){
    let distX = Math.abs(circle.x - rect.x);
    let distY = Math.abs(circle.y - rect.y);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2) && distY <= (rect.h/2)) { return true; }

    let dx = distX;
    let dy = distY;
    return (dx**2 + dy**2 <= circle.r**2);
}

global.updateScore = function (obj, cellType) {
    let score = 0;
    switch (cellType) {
        case 'square':
            score = 10;
            break;
        case 'triangle':
        case 'attacker':
            score = 15;
            break;
        case 'pentagon':
            score = 130;
            break;
    }
    obj.score += score;

    let levels = obj.levelSettings;
    if (obj.score >= obj.prevLevelsTotal + levels[obj.level+1]) {
        let sum = 0;
        for (let i in levels) {
            sum += levels[i];
            if (obj.score < sum) {
                obj.upgradedNTimes[8] += i -1 - obj.level;
                obj.prevLevelsTotal = sum - levels[i];
                obj.level = obj.levelSettings.indexOf(levels[i-1]);
                obj.r = 10 + obj.level/20;
                break;
            }
        }
    }
}

// let Geometry;
module.exports = {
    bulletCollision (obj, cells) {
        for (let j of obj.bullets) {
            for (let i of cells) {
                if (i.dead) return;
                if (RectCircleColliding(j, i)) {
                    j.health -= i.bodyDamage + obj.penetration;
                    if (j.health <= 0) {
                        obj.bullets.splice(obj.bullets.indexOf(j), 1);
                    }
                    i.health -= obj.bulletDamage;
                    if (i.health <= 0) {
                        i.dead = true;
                        setTimeout(() => {
                            cells.push(Geometry.prototype.createCell());
                        }, 3000);
                        updateScore(obj, i.type);
                        return;
                    }
                    else i.lastDamaged = Date.now();
                    let vx, vy;
                    if (j.speedX < 0) {
                        vx = -1;
                    }
                    else if (j.speedX > 0) {
                        vx = 1;
                    }
                    if (j.speedY < 0) {
                        vy = -1;
                    }
                    else if (j.speedY > 0) {
                        vy = 1;
                    }
                    i.vx = 2 * vx|0;
                    i.vy = 2 * vy|0;
                    i.x += i.vx;
                    i.y += i.vy;
                }
            }
        }
    },
    bodyCollision (obj, cells) {
        for (let i of cells) {
            if (i.dead) return;
            if (RectCircleColliding(obj, i)) {
                obj.health -= i.bodyDamage;
                if (obj.health <= 0)
                    obj.dead = true;
                else obj.lastDamaged = Date.now();
                i.health -= obj.bodyDamage;
                if (i.health <= 0) {
                    i.dead = true;
                    setTimeout(() => {
                        cells.push(Geometry.prototype.createCell());
                    }, 1000);
                    updateScore(obj, i.type);
                    return;
                }
                else i.lastDamaged = Date.now();
                let vx, vy;
                if (obj.moveButtons.left === true) {
                    vx = -1;
                }
                else if (obj.moveButtons.right === true) {
                    vx = 1;
                }
                if (obj.moveButtons.up === true) {
                    vy = -1;
                }
                else if (obj.moveButtons.down === true) {
                    vy = 1;
                }
                i.vx = 5 * vx|0;
                i.vy = 5 * vy|0;
                i.x += i.vx;
                i.y += i.vy;
                obj.x -= i.vx*1.2;
                obj.y -= i.vy*1.2;
            }
        }
    }
}