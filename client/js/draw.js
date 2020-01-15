const canvas = document.getElementById`canvas`,
    ctx = canvas.getContext`2d`,
    now = () => Date.now();
let cw, ch;
let random = (min, max) => ~~(Math.random() * (max - min) + min);

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
            if (!scale)
                ctx.stroke();
            ctx.fill();
            ctx.closePath();
        }
        else if (obj.type == 'triangle') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'red';
            ctx.moveTo(-obj.w/2, -obj.h/2);
            ctx.lineTo(obj.w, -obj.h/2);
            ctx.lineTo(obj.w/2-4, obj.h-2);
            ctx.lineTo(-obj.w/2, -obj.h/2);
            ctx.fill();
            // ctx.fillStyle = '#000';
            ctx.closePath();
        }
        else if (obj.type == 'pentagon') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = 'rgb(118, 141, 252)';
            var a = Math.PI * 2/5;
            ctx.moveTo(obj.w, 0);
            for (var i = 1; i < 5; i++) {
                ctx.lineTo(obj.w * Math.cos(a*i), obj.w * Math.sin(a*i));
            }
            ctx.lineTo(obj.w, 0)
            // ctx.lineTo(-obj.w/2, -obj.h/2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.closePath();
        }
        else if (obj.type == 'hexagon') {
            ctx.beginPath();
            ctx.strokeWidth = 4;
            ctx.fillStyle = '#000';
            var a = Math.PI * 2/5;
            ctx.moveTo(0, -obj.h/2-2);
            ctx.lineTo(obj.w/2, -obj.h/3.5);
            ctx.lineTo(obj.w/2, obj.h/3.5);
            ctx.lineTo(0, obj.h/2+2);
            ctx.lineTo(-obj.w/2, obj.h/3.5);
            ctx.lineTo(-obj.w/2, -obj.h/3.5);
            ctx.lineTo(0, -obj.h/2-2);
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
            ctx.moveTo(-obj.w/2, -obj.h/2);
            ctx.lineTo(obj.w, obj.h/2-2);
            ctx.lineTo(-obj.w/2, obj.h);
            ctx.lineTo(-obj.w/2, -obj.h/2);
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
        w = obj.w || obj.r*2,
        h = obj.h || obj.r*2;
    
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

let fortress = {
    side : 50,
    x : cw/2,
    y : ch/2,
    health: 100,
    DrawFortress() {
        ctx.beginPath
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x , this.y - this.side/2);
        ctx.lineTo(this.x + this.side/4, this.y);
        ctx.lineTo(this.x + this.side*2/4, this.y - this.side/2);
        ctx.lineTo(this.x + this.side*3/4, this.y);
        ctx.lineTo(this.x + this.side, this.y - this.side/2);
        ctx.lineTo(this.x + this.side ,this.y);
        ctx.lineTo(this.x + this.side ,this.y + this.side);
        ctx.lineTo(this.x ,this.y + this.side);
        ctx.lineTo(this.x,this.y);
        ctx.lineTo(this.x + this.side,this.y);
        ctx.strokeStyle = "purpule";
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
}


function game () {
    scene.clear();
    fortress.DrawFortress();
    for (let i in players) {
        let player = players[i];
        drawHealth(player);
        draw(player);
    }
    for (let i = 0; i < enemies.length; i++) {
        draw(enemies[i])
    }
    ctx.font = "40px serif";
    ctx.fillText("Array.filter[]", 200, 40);

    for (let i of cells) {
        if (i.dead) {
            Geometry.prototype.draw(i, true);
            continue;
        }
        drawHealth(i);
        Geometry.prototype.draw(i);
    }
    
    if (isNight) {
        ctx.fillStyle = 'rgba(33, 33, 33, .7)';
        ctx.fillRect(0, 0, 600, 600);
    }
    let player = players[sock.id];
    if (!player) return;
    if (mousedown && player.canShoot
        || player.buttons.e && player.canShoot
    ) shoot(player);

    Tank.prototype.drawUpgrades(player);
    Tank.prototype.drawScoreAndUpdates(player);
    scene.drawMiniMap(player.x, player.y);

    requestAnimationFrame(game);
    
}
