let sock = io();
let mousedown = false;

let players = {};
let enemies = [];
let isNight = false;

sock.on('updateCells', function (obj) {
    cells = obj;
})

sock.on('updateEnemies', function (obj) {
    enemies = obj;
})



sock.on('update', function (obj) {
    if (obj.objects) {
        for (let i in obj.objects) {
            eval(i + ' = obj.objects[i]');
        }
    }
    else if (!obj.property && !obj.props) {
        if (!obj.id) players = obj;
        else players[obj.id] = obj;
        // players[obj.id].prototype = Tank.prototype;
    }
    else {
        let updatedPlayer = players[obj.id];
        if (!updatedPlayer) return;
        if (typeof obj.property === 'string')
            updatedPlayer[obj.property] = obj.value;
        else if (obj.props) {
            let props = obj.props;
            // [index: i, [[path to property], value]: prop]
            for (let i = 0; i < props.length; i++) {
                let arr = props[i]; // [prop, value]
                let property = arr[0]; // prop
                

                if (property instanceof Array) {
                    let path = updatedPlayer[property[0]], last, len = property.length;

                    for (let j = 0; j < len; j++) {
                        if (j == len -1 && j > 0) {
                            last = property[j];
                            break;
                        }
                        path = path[property[j]];
                    }
    
                    path[last] = arr[1]; // value
                }
                else updatedPlayer[property] = arr[1];

            }
        }
        else if (obj.property instanceof Array) {
            let path = players[obj.id], last, len = obj.property.length;
            for (let i = 0; i < len; i++) {
                if (i == len -1 && i > 0) {
                    last = obj.property[i];
                    break;
                }
                path = path[obj.property[i]];
            }

            path[last] = obj.value;
        }
    }
});

// init the game
(function () {
    let initServerTimeoutlId = () => {
        if (Object.keys(players).length === 0 || !players[sock.id]) {
            setTimeout(initServerTimeoutlId, 100);
            return;
        }
        let rotatedLastTime = 0;

        canvas.addEventListener('mousemove', e => {
            if (now() < rotatedLastTime + 20) return;
            rotatedLastTime = now();
            Tank.prototype.rotate(players[sock.id], e);
        });

        canvas.addEventListener('mousedown', e => {
            if (Object.keys(players[sock.id].availableClasses).length > 0) {
                let ex = e.clientX;
                let ey = e.clientY;
                
                let available = players[sock.id].availableClasses;
                let x = 20;
                let y = 20;
                for (let i in available) {
                    if (ex > x
                        && ex < x + 70
                        && ey > y
                        && ey < y + 70)
                    {
                        sock.emit('changeTank', i);
                        return;
                    }
                    else {
                        x += 75;
                        if (x > 95) {
                            x = 20;
                            y += 75;
                        }
                    }
                }
            }
            mousedown = true;
            Tank.prototype.shoot(players[sock.id], e);
        });
        canvas.addEventListener('mouseup', () => mousedown = false);
        canvas.addEventListener('contextmenu', e => e.preventDefault());

        canvas.addEventListener('keydown', e => Tank.prototype.moveHandler(players[sock.id], e));
        canvas.addEventListener('keyup', e => Tank.prototype.moveHandler(players[sock.id], e));
        canvas.addEventListener('keypress', e => Tank.prototype.keyHandler(players[sock.id], e));

        requestAnimationFrame(game);
    };

    setTimeout(initServerTimeoutlId, 200);
})();

// var suite = new Benchmark.Suite;

// // add tests
// suite.add('with', function() {
//     with(ctx) {
//         with (fortresst) {
//             beginPath();
//             moveTo(cw/2,ch/2);
//             lineTo(x,y);
//             lineTo(x , y - side/2);
//             lineTo(x + side/4, y);
//             lineTo(x + side*2/4, y - side/2);
//             lineTo(x + side*3/4, y);
//             lineTo(x + side, y - side/2);
//             lineTo(x + side ,y);
//             lineTo(x + side ,y + side);
//             lineTo(x ,y + side);
//             lineTo(x,y);
//             lineTo(x + side,y);
//             strokeStyle = "purpule";
//             fill();
//             stroke();
//             closePath();
//         }
//     }
// })
// .add('ctx', function() {
//     ctx.beginPath();
//     ctx.moveTo(cw/2,ch/2);
//     ctx.lineTo(fortresst.x,fortresst.y);
//     ctx.lineTo(fortresst.x , fortresst.y - fortresst.side/2);
//     ctx.lineTo(fortresst.x + fortresst.side/4, fortresst.y);
//     ctx.lineTo(fortresst.x + fortresst.side*2/4, fortresst.y - fortresst.side/2);
//     ctx.lineTo(fortresst.x + fortresst.side*3/4, fortresst.y);
//     ctx.lineTo(fortresst.x + fortresst.side, fortresst.y - fortresst.side/2);
//     ctx.lineTo(fortresst.x + fortresst.side ,fortresst.y);
//     ctx.lineTo(fortresst.x + fortresst.side ,fortresst.y + fortresst.side);
//     ctx.lineTo(fortresst.x ,fortresst.y + fortresst.side);
//     ctx.lineTo(fortresst.x,fortresst.y);
//     ctx.lineTo(fortresst.x + fortresst.side,fortresst.y);
//     ctx.strokeStyle = "purpule";
//     ctx.fill();
//     ctx.stroke();
//     ctx.closePath();
// })
// // add listeners
// .on('cycle', function(event) {
//     console.log(String(event.target));
// })
// .on('complete', function() {
//     console.log('Fastest is ' + this.filter('fastest').map('name'));
// })
// // run async
// .run({ 'async': true });