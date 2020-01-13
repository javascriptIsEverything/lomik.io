let Tank = require('../tank');
let classes = require('../classes');
let sin,cos;
let createClass = name => {
    let t = new Tank(0, 0).simplify;
    classes.call(t, name);
    return t;
};

let classStructure = {
    twin: {
        tripleshot: {
            pentashot: null,
            octoTank: null,
            triple: null
        },
        twinHawk: {
            tripleTwin: null,
        },
        quadTank: {
            octoTank: null
        }
    },
    sniper: null,
    machineGun: null
};

function move(Tank) {
    let movepoint = {
        x: 0,
        y: 0,
        angle: 0,
    }
    if (Tank.isMoving) {
        // if (buttons.left) dx = -1;
        // if (buttons.right) dx = 1;
        // if (buttons.up) dy = -1;
        // if (buttons.down) dy = 1;
        let buttons = Tank.moveButtons;
        if (buttons.left){
            movepoint.x = Tank.x + Tank.r + 10;
        };
        if (buttons.right){
            movepoint.x = Tank.x - Tank.r - 10;
        };
        ;
        if (buttons.up){
            movepoint.y = Tank.y - Tank.r - 10;
        };
        if (buttons.down){
            movepoint.y = Tank.y + Tank.r + 10;
        };
                movepoint.angle = -Math.atan2(Tank.y - movepoint.y, -(Tank.x - movepoint.x));
            sin =  Math.sin(movepoint.angle),
            cos =  Math.cos(movepoint.angle);
            console.log(sin,cos);
            // Tank.y += cos;
            // Tank.x += sin;

    // let dx = 0,
    //     dy = 0;//
        // are keys opposite
        // if (buttons.left && buttons.right) dx = 0;
        // if (buttons.up && buttons.down) dy = 0;
        // if (dx !== 0 || dy !== 0) {
        //     let x = +(player.x + player.speed * dx).toFixed(2);
        //     let y = +(player.y + player.speed * dy).toFixed(2);
        //     if (x > player.r && x < 600 - player.r)
        //         player.x = x;
        //     if (y > player.r && y < 600 - player.r)
        //         player.y = y;

        //     isOutOfBox(player);
        // }
    }
}

function isOutOfBox(obj) {
    let r = obj.r | 0;
    if (obj.x - r <= 0)
        obj.x = r;
    else if (obj.x + r >= 600)
        obj.x = 600 - (r || obj.w | 0);
    if (obj.y - r <= 0)
        obj.y = r;
    else if (obj.y + r >= 600)
        obj.y = 600 - (r || obj.h | 0);
}

function updateLevel(player) {
    if (player.level > player.classPath.length * 2) {
        player.availableClasses = {};
        let tmp = classStructure;
        for (let i = 0, len = player.classPath.length; i < len; i++) {
            tmp = tmp[player.classPath[i]];
        }
        for (let i in tmp) {
            player.availableClasses[i] = createClass(i);
        }
    } else player.availableClasses = [];
}

function regen(obj, now) {
    if (obj.lastDamaged + obj.regeneration.delay < now) {
        obj.health += obj.regeneration.speed;
        if (obj.health > obj.maxHealth) {
            obj.health = obj.maxHealth;
        }
    }
}

module.exports = {
    // MoveAngleReading,
    classStructure,
    move,
    isOutOfBox,
    updateLevel,
    regen
}