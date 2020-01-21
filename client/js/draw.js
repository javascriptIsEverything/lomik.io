const canvas = document.getElementById`canvas`,
    ctx = canvas.getContext`2d`,
    now = () => Date.now();
let cw, ch;
let random = (min, max) => ~~(Math.random() * (max - min) + min);
let second_1 = Date.now(),
    second_2 = Date.now();
canvas.focus();

function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 + w1 > x2
        && x1 < x2 + w2
        && y1 + h1 > h2
        && y1 < y2 + h2);
}

// return true if the rectangle and circle are colliding
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

function CircularCollision(circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.r + circle2.r) {
        return true;
    }
}

class Scene {
    constructor() {
        this.w = 600;
        this.h = 600;
        canvas.width = this.w;
        canvas.height = this.h;
        cw = this.w, ch = this.h;

        this.minimap = {
            x: this.w - this.w/6,
            y: this.h - this.h/6,
            width: this.w/6,
            height: this.h/6,
            color: 'rgba(33, 33, 33, .3)'
        };
    }
    clear () {
        ctx.clearRect(0, 0, this.w, this.h);
    }
    drawMiniMap (x, y, r) {
        ctx.fillStyle = this.minimap.color;
        ctx.fillRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);
        ctx.strokeRect(this.minimap.x, this.minimap.y, this.minimap.width, this.minimap.height);
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.minimap.x +x/6, this.minimap.y + y/6, 2, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
    }
}

class Geometry {
    constructor (type) {
        this.w = 15;
        this.h = 15;
        this.r = 7.5;
        this.x = random(this.w, cw-this.w),
        this.y = random(this.h, ch-this.h);
        if (type == 'square') {
            this.maxHealth = 4;
            this.bodyDamage = 1;
        }
        else if (type == 'triangle') {
            this.maxHealth = 13;
            this.bodyDamage = 1.5;
        }
        this.health = this.maxHealth;
        this.regeneration = {
            started: false,
            speed: .02,
            delay: 3000
        }
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.direction = random(0, 1) > .5 ? 1 : -1;
        this.angle = random(0, 360);
        this.dead = false;
        this.scale = 1;
    }
    die (obj = this) {
        cells.splice(cells.indexOf(obj), 1);
    }
    draw (obj = this, scale = false) {
        obj.x += obj.vx;
        obj.y += obj.vy;
        if (obj.vx > 0) obj.vx-=.2;
        else if (obj.vx < 0) obj.vx += .2;
        if (obj.vy > 0) obj.vy-=.2;
        else if (obj.vy < 0) obj.vy += .2;
        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.angle);
        if (scale) {
            ctx.scale(obj.scale, obj.scale);
        }
        if (obj.type == 'square') {
            ctx.beginPath();
            ctx.lineTo(-obj.r,obj.r);
            ctx.lineTo(obj.r,obj.r);
            ctx.lineTo(obj.r,-obj.r);
            ctx.lineTo(-obj.r,-obj.r);
            ctx.fillStyle = 'rgb(255, 232, 105)';
            ctx.fill();
            ctx.closePath();
        }
        else if (obj.type == 'triangle') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'red';
            ctx.moveTo(-obj.r, -obj.r);
            ctx.lineTo(obj.r*2, -obj.r);
            ctx.lineTo(obj.r-4, obj.r*2-2);
            ctx.lineTo(-obj.r, -obj.r);
            ctx.fill();
            // ctx.fillStyle = '#000';
            ctx.closePath();
        }
        else if (obj.type == 'pentagon') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'rgb(118, 141, 252)';
            let a = Math.PI * 2/5;
            ctx.moveTo(obj.r*2, 0);
            for (let i = 1; i < 5; i++) {
                ctx.lineTo(obj.r*2 * Math.cos(a*i), obj.r*2 * Math.sin(a*i));
            }
            ctx.lineTo(obj.r*2, 0)
            // ctx.lineTo(-obj.w/2, -obj.h/2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.closePath();
        }
        else if (obj.type == 'hexagon') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = '#000';
            let a = Math.PI * 2/5;
            ctx.moveTo(0, -obj.r-2);
            ctx.lineTo(obj.r, -obj.r*2/3.5);
            ctx.lineTo(obj.r, obj.r*2/3.5);
            ctx.lineTo(0, obj.r+2);
            ctx.lineTo(-obj.r, obj.r*2/3.5);
            ctx.lineTo(-obj.r, -obj.r*2/3.5);
            ctx.lineTo(0, -obj.r-2);
            // let a = 100,
            //     x = 100,
            //     y = 0;
            // ctx.moveTo(x, y);
            // ctx.lineTo(obj.w * Math.sqrt(3) / 2, y - obj.w / 2);
            // ctx.lineTo(obj.w * Math.sqrt(3), y);
            // ctx.lineTo(obj.w * Math.sqrt(3), y + obj.w);
            // ctx.lineTo(obj.w * Math.sqrt(3) / 2, y + obj.w / 2 + obj.w);
            // ctx.lineTo(x, y + obj.w);
            // ctx.lineTo(x, y)
            // ctx.lineWidth = 3;
            // ctx.stroke()
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.closePath();
        }
        else if (obj.type == 'attacker') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'rgb(252, 118, 119)';
            ctx.moveTo(-obj.r, -obj.r);
            ctx.lineTo(obj.r*2, obj.r-2);
            ctx.lineTo(-obj.r, obj.r*2);
            ctx.lineTo(-obj.r, -obj.r);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.closePath();
        }
        if (!scale)
            ctx.stroke();
        ctx.restore();
        // obj.drawHealth();
        obj.angle += .01 * obj.direction;
        if (obj.angle >= 360) obj.angle = 0; 
    }
}

function drawHealth(obj) {
    if (obj.dead) return;
    let x = obj.x,
        y = obj.y,
        w = obj.side || obj.r*2,
        h = obj.side || obj.r*2;
    
    let width, wholeWidth = w+8;
    if (obj.maxHealth != obj.health) {
        let percent = obj.health * 100 / obj.maxHealth;
        width = wholeWidth * percent / 100;
    }
    else {
        width = wholeWidth;
        return;
    }
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.fillRect(x-w/2-5, y + h+3, w+10, 5);
    ctx.fillStyle = 'lime';
    ctx.fillRect(x-w/2-4, y + h+4, width, 3);
    ctx.closePath();
}

const scene = new Scene();
let cells = [];

let draw = Tank.prototype.draw;
let shoot = Tank.prototype.shoot;

function drawCastle() {
    with(ctx) {
        with (castle) {
            beginPath();
            save();
            translate(-side/2, -side/2);
            lineTo(x , y - side/2);
            lineTo(x + side/4, y);
            lineTo(x + side*2/4, y - side/2);
            lineTo(x + side*3/4, y);
            lineTo(x + side, y - side/2);
            lineTo(x + side ,y);
            lineTo(x + side ,y + side);
            lineTo(x, y + side);
            lineTo(x,y);
            // lineTo(x + side,y);
            strokeStyle = "purpule";
            fillStyle = '#000';
            fill();
            // stroke();
            closePath();
            restore();
        }
    }
    // if (castle.health < castle.maxHealth) {
        // drawHealth(castle);
    // }
}

let paused = false;

function gameOver() {
    ctx.beginPath();
    ctx.fillStyle = 'tomato';
    ctx.font = "80px Arial";
    ctx.fillText("Game Over", cw/2 - cw/3 , ch/2);
    ctx.font = "68px Arial";
    ctx.fillText("You are top FILTER", cw/2 - cw/2 , ch/2+90);
    ctx.font = "50px Arial";
    ctx.fillText(`Your record is ${~~((castle.lastedUntill - castle.aliveFrom)/1000)} seconds`, cw/2 - cw/2 , ch/2 +180);
    ctx.font = '40px Verdana';
    ctx.fillText(`New game starts in ${seconds} seconds`, cw/2 - cw/2 , ch/2 +230);
}

function game () {
    if (paused) return;
    scene.clear();
    ctx.fillStyle = `rgba(33, 33, 33, ${opacity})`;
    ctx.fillRect(0, 0, cw, ch);
    drawHealth(castle);
    drawCastle();
    for (let i in players) {
        let player = players[i];
        drawHealth(player);
        draw(player);
    }
    for (let i = 0; i < enemies.length; i++) {
        drawHealth(enemies[i]);
        draw(enemies[i]);
    }
    ctx.fillStyle = '#000';
    ctx.font = "40px serif";
    ctx.fillText("[{ Lomik.io }]", 200, 40);

    for (let i of cells) {
        if (i.dead) {
            Geometry.prototype.draw(i, true);
            continue;
        }
        drawHealth(i);
        Geometry.prototype.draw(i);
    }

    if (isNight) { //night
        ctx.fillStyle = 'rgba(33, 33, 33, .7)';
        ctx.fillRect(0, 0, 600, 600);
    }
    let player = players[sock.id];
    if (!player) return;
    if (castle.dead) { // Game over
        // second_2 = Date.now();        
        gameOver();
        // clearAnimationFrame(game);
    }
    else {
        if (mousedown && player.canShoot
            || player.buttons.e && player.canShoot
        ) shoot(player);
        Tank.prototype.drawUpgrades(player);
        Tank.prototype.drawScoreAndUpdates(player);
    }
    scene.drawMiniMap(player.x, player.y);

    requestAnimationFrame(game);
}
