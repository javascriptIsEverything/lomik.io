module.exports = function (type = 'default', obj) {
    let r = 6;
    switch (type) {
        case 'twin':
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
            break;
        case 'machineGun':
            this.reloadDelay -= 100;
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
            break;
        case 'destroyer': //big gun
            r = 10;
            this.bulletSpeed += .4;
            this.bulletDamage += .5;
            this.spread = [-.3, .3];
            this.guns = [{
                x: 0,
                y: -10,
                r,
                width: 25,
                height: 20,
                angle: 0,
            }];
            break;
        case 'hybrid': //big gun + overseer
            r = 10;
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
            break;
        case 'annihilator': //biggggggg gun
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
            break;
        case 'skimmer': //big gun + norm gun
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
            break;
        case 'gunner': //mahine gunic hedo 4 stvlka
            r = 3.5;
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
            }].map(i => {i.r = r; return i});
            break;
        case 'sniper':
            r = 5;
            this.bulletSpeed += .4;
            this.bulletDamage += .5;
            this.spread = [-.3, .3];
            this.guns = [{
                x: 0,
                y: -this.r / 2,
                r,
                width: 35,
                height: 10,
                angle: 0,
            }]
            break;
        case "overseer":
            r = 6;
            this.spread = [-.6, .6];
            this.guns = [{
                x: 0,
                y: -this.r / 2,
                r,
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
            break;
        case 'tripleTwin':
            r = 6;
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
            break;
        case 'quadTank':
            r = 6;
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
            break;
        case 'octoTank':
            r = 6;
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
            break;
        case 'tripleshot':
            r = 7;
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
            break;
        case 'twinHawk':
            r = 7;
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
            break;
        case 'triple':
            let h = 6;
            r = 6;
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
            break;
        case 'pentashot':
            r = 7;
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
            break;
        case "flankguard": // body dimigov elnoxy
            r = 4;
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
            break;
        case "tri_angle": 
            r = 4;
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
            break;
        case "booster": // Без комментарий...
            r = 4;
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
            }].map(i => {i.r = r; return i});
            break;
        case "fighter":
            r = 4;
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
            }].map(i => {i.r = r; return i});
            break;
        default: return;
    }
    this.className = type;
    this.classPath.push(type);
}