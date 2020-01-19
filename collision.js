let gameover = false;

function RectCircleColliding(circle, rect) {
    let distX = Math.abs(circle.x - rect.x-rect.r);
    let distY = Math.abs(circle.y - rect.y-rect.r);

    if (distX > (rect.r + circle.r)) { return false; }
    if (distY > (rect.r + circle.r)) { return false; }

    if (distX <= (rect.r)) { return true; } 
    if (distY <= (rect.r)) { return true; }

    let dx = distX-rect.r;
    let dy = distY-rect.r;
    return (dx**2 + dy**2 <= circle.r**2);
}

function CircularCollision(circle1, circle2) {
    return ((circle1.x - circle2.x)**2 + (circle1.y - circle2.y)**2)**.5 < circle1.r + circle2.r;
    // let dx = circle1.x - circle2.x;
    // let dy = circle1.y - circle2.y;
    // let distance = (dx * dx + dy * dy)**.5;

    // return (distance < circle1.r + circle2.r);
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
        case 'hexagon':
        case 'enemy':
            score = 250;
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

module.exports = {
    bulletCollision (obj, cells) {
        for (let i = 0, len = obj.bullets.length; i < len; i++) {
            let bullet = obj.bullets[i];
            // for (let j = 0, len = cells.length;  j < len; j++) {
            for (let j in cells) {
                let cell = cells[j];
                if (cell.dead) return;
                if (CircularCollision(bullet, cell)) {
                    bullet.health -= cell.bodyDamage + obj.penetration;
                    if (bullet.health <= 0) {
                        obj.bullets.splice(obj.bullets.indexOf(bullet), 1);
                    }
                    cell.health -= obj.bulletDamage;
                    if (cell.health <= 0) {
                        cell.dead = true;
                        if (cells.length) {
                            setTimeout(() => {
                                cells.push(Geometry.prototype.createCell());
                            }, 3000);
                            updateScore(obj, cell.type);
                            return;
                        }
                    }
                    else cell.lastDamaged = now;
                    let vx, vy;
                    if (bullet.speedX < 0) {
                        vx = -1;
                    }
                    else if (bullet.speedX > 0) {
                        vx = 1;
                    }
                    if (bullet.speedY < 0) {
                        vy = -1;
                    }
                    else if (bullet.speedY > 0) {
                        vy = 1;
                    }
                    cell.vx = 2 * vx|0;
                    cell.vy = 2 * vy|0;
                    cell.x += cell.vx;
                    cell.y += cell.vy;
                }
            }
            for (let j in enemies) {
                let enemy = enemies[j];
                if (enemy.dead) return;
                if (CircularCollision(bullet, enemy)) {
                    bullet.health -= enemy.bodyDamage + obj.penetration;
                    if (bullet.health <= 0) {
                        obj.bullets.splice(obj.bullets.indexOf(bullet), 1);
                    }
                    enemy.health -= obj.bulletDamage;
                    if (enemy.health <= 0) {
                        enemies.splice(enemies.indexOf(enemy), 1);
                        if (enemies.length) {
                        //     setTimeout(() => {
                        //         cells.push(Geometry.prototype.createCell());
                        //     }, 3000);
                            updateScore(obj, 'enemy');
                            return;
                        }
                    }
                    else enemy.lastDamaged = now;
                    let vx, vy;
                    if (bullet.speedX < 0) {
                        vx = -1;
                    }
                    else if (bullet.speedX > 0) {
                        vx = 1;
                    }
                    if (bullet.speedY < 0) {
                        vy = -1;
                    }
                    else if (bullet.speedY > 0) {
                        vy = 1;
                    }
                    enemy.vx = 2 * vx|0;
                    enemy.vy = 2 * vy|0;
                    enemy.x += enemy.vx;
                    enemy.y += enemy.vy;
                }
            }
        }
    },
    bodyCollision (obj, cells) {
        // for (let i = 0, len = cells.length;  i < len; i++) {
        for (let i in cells) {
            let cell = cells[i];
            if (cell.dead) return;
            if (CircularCollision(obj, cell))  {
                obj.health -= cell.bodyDamage;
                if (obj.health <= 0)
                    obj.dead = true;
                else obj.lastDamaged = now;
                cell.health -= obj.bodyDamage;
                if (cell.health <= 0) {
                    cell.dead = true;
                    if (cells.length) {
                        setTimeout(() => {
                            cells.push(Geometry.prototype.createCell());
                        }, 3000);
                        updateScore(obj, cell.type);
                        return;
                    }
                }
                else cell.lastDamaged = now;
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
                cell.vx = 5 * vx|0;
                cell.vy = 5 * vy|0;
                cell.x += cell.vx;
                cell.y += cell.vy;
                obj.x -= cell.vx*1.2;
                obj.y -= cell.vy*1.2;
            }
        }
    },
    castleCollision () {
        for (let i = 0, len = enemies.length; i < len; i++) {
            let enemy = enemies[i];
            // if (RectCircleColliding(enemy, castle))  {aw
            if (enemy.x + enemy.r > castle.x - castle.side/2
                && enemy.x - enemy.r < castle.x + castle.side/2
                && enemy.y + enemy.r > castle.y - castle.side/2
                && enemy.y - enemy.r < castle.y + castle.side/2){
                castle.health -= enemy.bodyDamage;
                if (castle.health <= 0)
                    castle.dead = true;
                else castle.lastDamaged = now;
                enemy.health -= castle.bodyDamage;
                if (enemy.health <= 0) {
                    enemy.dead = true;
                }
                else enemy.lastDamaged = now;
            }
            for (let j = 0, len = enemy.bullets.length; j < len; j++) {
                let bullet = enemy.bullets[j];
                
            // if (RectCircleColliding(bullet, castle))  {
                if (bullet.x + bullet.r > castle.x - castle.side/2
                    && bullet.x - bullet.r < castle.x + castle.side/2
                    && bullet.y + bullet.r > castle.y - castle.side/2
                    && bullet.y - bullet.r < castle.y + castle.side/2)
                {
                    castle.health -= enemy.bulletDamage + enemy.penetration;
                    if (castle.health <= 0)
                    castle.dead = true;
                    else castle.lastDamaged = now;

                    bullet.health -= castle.bodyDamage;
                    if (bullet.health <= 0) {
                        enemy.bullets.splice(enemy.bullets.indexOf(bullet), 1);
                    }
                }
            }
        }
    }
}