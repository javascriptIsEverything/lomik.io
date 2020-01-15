module.exports = function (type = 'default', obj) {
    if (type == 'twin') {
        let r = 6;
        this.guns = [{
                x: 0,
                y: -this.r,
                width: 30,
                height: 8,
                angle: 0
            },
            {
                x: 0,
                y: 0,
                width: 30,
                height: 8,
                angle: 0
            },
        ].map(i => {i.r = r; return i});
    } else if (type == 'machineGun') {
        let r = 6;
        this.reloadDelay -= 250;
        this.spread = [-.6, .6];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
            points: [
                [0, 2],
                [20, 10],
                [20, -10],
                [0, -2]
            ]
        }].map(i => {i.r = r; return i});
    } else if (type == 'destroyer') {//big gun
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -10,
            r: 10,
            width: 25,
            height: 20,
            angle: 0,
        }]
    } else if (type == 'hybrid') {//big gun + overseer
        this.bulletR = 10;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -10,
            width: 25,
            height: 20,
            angle: 0,
        },{
            x: 0,
            y: 0,
            angle: Math.PI,
            points: [
                [0, 7],
                [-20, 10],
                [-20, -10],
                [0, -7]
            ],
        }]
    } else if (type == 'annihilator') {//biggggggg gun
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -12.5,
            r: 12.5,
            width: 30,
            height: 25,
            angle: 0,
        }]
    } else if (type == 'skimmer') {//big gun + norm gun
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -8,
            r: 8,
            width: 28,
            height: 16,
            angle: 0,
        },{
            x: 0,
            y: -10,
            r: 10,
            width: 25,
            height: 20,
            angle: 0,
        }]
    } else if (type == 'gunner') {//mahine gunic hedo 4 stvlka
        let r = 3.5;
        this.guns = [{
                x: 0,
                y: -this.r,
                width: 20,
                height: 4,
                angle: 0
            },
            {
                x: 0,
                y: this.r - 4,
                width: 20,
                height: 4,
                angle: 0
            },
            {
                x: 0,
                y: -this.r / 2 ,
                width: 22,
                height: 4,
                angle: 0
            },
            {
                x: 0,
                y: this.r/2 - 4,
                width: 22,
                height: 4,
                angle: 0
            },
        ].map(i => {i.r = r; return i});
    } else if (type == 'sniper') {
        this.bulletR = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            r: 5,
            width: 35,
            height: 10,
            angle: 0,
        }]
    } else if (type == "overseer") {
        this.bulletR = 6;
        this.spread = [-.6, .6];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
            points: [
                [0, 5],
                [-20, 10],
                [-20, -10],
                [0, -5]
            ],
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: -Math.PI,
            points: [
                [0, 5],
                [20, 10],
                [20, -10],
                [0, -5]
            ],
        }];
        this.canShoot = false;
        let bullet = Geometry.prototype.createCell('attacker');
        bullet.x = obj.x | 0 + 200;
        bullet.y = obj.y | 0 + 200;
        bullet.color = 'red';
        this.bullets.push(bullet);
    } else if (type == 'tripleTwin') {
        let r = 6;
        this.guns = [{
            x: 0,
            y: -this.r,
            width: 30,
            height: 10,
            angle: 0
        },
        {
            x: 0,
            y: 0,
            width: 30,
            height: 10,
            angle: 0
        },
        {
            x: 0,
            y: -this.r,
            width: 30,
            height: 10,
            angle: Math.PI + 5.3
        },
        {
            x: 0,
            y: 0,
            width: 30,
            height: 10,
            angle: Math.PI + 5.3
        },
        {
            x: 0,
            y: -this.r,
            width: 30,
            height: 10,
            angle: Math.PI - 5.3
        },
        {
            x: 0,
            y: 0,
            width: 30,
            height: 10,
            angle: Math.PI - 5.3
        },
        ].map(i => {i.r = r; return i});
    } else if (type == 'quadTank') {
        let r = 6;
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 1.55
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: Math.PI
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: -1.55
        }].map(i => {i.r = r; return i});
    } else if (type == 'octoTank') {
        let r = 6;
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: -1.55
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: -1.55 * 1.5
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: -1.55 / 2
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 1.55 / 2
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 1.55
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 1.55 * 1.5
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: Math.PI
        }].map(i => {i.r = r; return i});
    } else if (type == 'tripleshot') {
        let r = 7;
        this.guns = [{
            x: 0,
            y: -this.r + 1,
            width: 20,
            height: 8,
            angle: -.5
        },
        {
            x: 0,
            y: this.r / 2 - 5,
            width: 20,
            height: 8,
            angle: .5
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 25,
            height: 8,
            angle: 0
        }].map(i => {i.r = r; return i});
    } else if (type == 'twinHawk') {
        let r = 7;
        this.guns = [{
            x: 0,
            y: -this.r,
            width: 25,
            height: 10,
            angle: Math.PI // 180 deg
        },
        {
            x: 0,
            y: 0,
            width: 25,
            height: 10,
            angle: Math.PI // 180 deg
        },
        {
            x: 0,
            y: -this.r,
            width: 25,
            height: 10,
            angle: 0
        },
        {
            x: 0,
            y: 0,
            width: 25,
            height: 10,
            angle: 0
        }].map(i => {i.r = r; return i});
    } else if (type == 'triple') {
        let h = 6;
        let r = 6;
        this.guns = [{
            x: 0,
            y: -h - 3,
            width: 25,
            height: h,
            angle: 0
        },
        {
            x: 0,
            y: -3,
            width: 25,
            height: h,
            angle: 0
        },
        {
            x: 0,
            y: h - 3,
            width: 25,
            height: h,
            angle: 0
        }].map(i => {i.r = r; return i});
    } else if (type == 'pentashot') {
        let r = 7;
        this.guns = [{
            x: 0,
            y: -this.r + 1,
            width: 20,
            height: 8,
            angle: -.35
        },
        {
            x: 0,
            y: this.r / 2 - 5,
            width: 20,
            height: 8,
            angle: .35
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 22,
            height: 8,
            angle: .2
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 22,
            height: 8,
            angle: -.2
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 25,
            height: 8,
            angle: 0
        }].map(i => {i.r = r; return i});
    } else if (type == "flankguard") {// body dimigov elnoxy
        let r = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
        },{
            x: 0,
            y: -this.r / 2,
            width: 25,
            height: 10,
            angle: Math.PI,
        }].map(i => {i.r = r; return i});
    } else if (type == "tri_angle") {//
        let r = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: 2.6,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: -2.6,
        },].map(i => {i.r = r; return i});
    } else if (type == "booster") {//
        let r = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
        },{
            x: 0,
            y: -this.r / 2,
            width: 20,
            height: 10,
            angle: 2.4,
        },{
            x: 0,
            y: -this.r / 2,
            width: 20,
            height: 10,
            angle: -2.4,
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: -2.6,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: 2.6,
        },].map(i => {i.r = r; return i});
    } else if (type == "fighter") {//
        let r = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [{
            x: 0,
            y: -this.r / 2,
            width: 30,
            height: 10,
            angle: 0,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: Math.PI/2,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: -Math.PI/2,
        },
        {
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: -2.6,
        },{
            x: 0,
            y: -this.r / 2,
            width: 23,
            height: 10,
            angle: 2.6,
        },].map(i => {i.r = r; return i});
    }else return;
    this.className = type;
    this.classPath.push(type);
}