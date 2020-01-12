const canvas = document.getElementById`canvas`,
    ctx = canvas.getContext`2d`,
    cw = canvas.width,
    ch = canvas.height,
    gravity = 2,
    scene = {
        width: cw,
        height: ch,
        leftBorder: 0,
        rightBorder: cw,
        topBorder: 0,
        bottomBorder: ch,
    },
    camera = {
        x: 0,
        y: 0,
        move(x, y) {
            return;
            this.x = x;
            this.y = y;
            if (x < scene.leftBorder) this.x = scene.leftBorder;
            else if (x > scene.rightBorder) this.x = scene.rightBorder;
            
            if (y < scene.topBorder) this.y = scene.topBorder;
            else if (y > scene.bottomBorder) this.y = scene.bottomBorder;
            // this.y = 0;
        }
    };

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 30;
        this.h = 90;
        let ballX = x + 40;
        let ballY = y + 30;
        this.ball = {
            initialX: ballX,
            initialY: ballY,
            x: ballX,
            y: ballY,
            reset() {
                this.x = ballX;
                this.y = ballY
            }
        };
        this.health = 100;
        this.isShooting = false;
    }
    shoot (angle) {
        this.vx = Math.cos(Math.PI / 180 * angle) * 15;
        this.vy = Math.sin(Math.PI / 180 * angle) * 18;
        this.isShooting = true;
        this.angle = angle;
    }
};

let player1 = new Player(50, ch-100);
let player2 = new Player(scene.rightBorder-80, ch-100);
// let player2 = new Player(cw*2-80, ch-100); // en 80@ dig -50-30nn e!
// let player2 = new Player(cw-100/2-30, ch-100);
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 + w1 > x2
        && x1 < x2 + w2
        && y1 + h1 > h2
        && y1 < y2 + h2);
}

function rect(x, y, w, h, color = '#000') {
    ctx.save();
    ctx.translate(x - camera.x, y - camera.y);
    // ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

function game() {
    ctx.clearRect(0, 0, scene.width, ch)
    rect(0, 0, scene.width, ch, '#ff7f50');
    rect(0, ch-10, scene.width, 10);

    with (player1) {
        rect(x, y, w, h, '#000');
        // ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 5, 2 * Math.PI, false);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        if (isShooting) {
            if (collision(
                ball.x-5, ball.y-5, 10, 10,
                player2.x, player2.y, player2.w, player2.h
            )) {
                isShooting = false;

                console.log(ball.y, player2.y);
                vx = 0;
                vy = 0;
                ball.reset();
                isShooting = false;
                camera.move(0, 0);
            }
            // if (ball.x > player2.x) {
            //     ball.x = player1.x+40;
            //     ball.y = player1.y+30;
            //     isShooting = false;
            //     camera.move(0, 0);
            // }
            if (ball.y >= ch-20) {
                ball.y -= 5;
                player1.shoot(-player1.angle);
            }
            ball.x += vx;
            ball.y += vy+gravity;
            vy*=.95;
            camera.move(ball.x-x-40, ball.y-y-30);
        }
    }
    with (player2) {
        rect(x, y, w, h, '#a5a');
    }

    requestAnimationFrame(game, 1000/60);
}
requestAnimationFrame(game, 1000/60);

document.addEventListener('click', e => {
    let x2 = e.pageX, y2 = e.pageY;
    let x1 = player1.ball.x, y1 = player1.ball.y;
    let result = Math.sin(((y2 - y1) / Math.sqrt((x2 - x1)**2 + (y2 - y1)**2)))* (180/Math.PI);
    player1.shoot(result)
});

document.addEventListener('keydown', e => {
    if (e.keyCode == 38) {
        player2.y -= 15;
    }
    else if (e.keyCode == 40) {
        player2.y+=15;
    } 
});