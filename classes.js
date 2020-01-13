let Geometry = require('./geometry')();

module.exports = function (type = 'default', obj) {
    if (type == 'twin') {
        this.bulletR = 6;
        this.guns = [
            {
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
        ]
    }
    else if (type == 'machineGun') {
        this.bulletR = 6;
        this.reloadDelay -= 250;
        this.spread = [-.6, .6];
        this.guns = [
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 0,
                points: [[0, 2], [20, 10], [20, -10], [0, -2]]
            }
        ]
    }
    else if ( type == "overseer") {
        this.bulletR = 6;
        this.spread = [-.6, .6];
        this.guns = [
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 0,
                points: [[0, 5], [-20, 10], [-20, -10], [0, -5]],
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: -Math.PI,
                points: [[0, 5], [20, 10], [20, -10], [0, -5]],
            },
        ];
        this.canShoot = false;
        let bullet = Geometry.prototype.createCell('attacker');
        bullet.x = obj.x|0+200;
        bullet.y = obj.y|0+200;
        bullet.color = 'red';
        this.bullets.push(bullet);
    }
    else if (type == 'sniper') {
        this.bulletR = 4;
        this.bulletSpeed += .4;
        this.bulletDamage += .5;
        this.spread = [-.3, .3];
        this.guns = [
            {
                x: 0,
                y: -this.r/2,
                width: 35,
                height: 10,
                angle: 0,
            }
        ]
    }
    else if (type == 'tripleTwin') {
        this.bulletR = 6;
        this.guns = [
            {
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
                angle: Math.PI+5.3
            },
            {
                x: 0,
                y: 0,
                width: 30,
                height: 10,
                angle: Math.PI+5.3
            },
            {
                x: 0,
                y: -this.r,
                width: 30,
                height: 10,
                angle: Math.PI-5.3
            },
            {
                x: 0,
                y: 0,
                width: 30,
                height: 10,
                angle: Math.PI-5.3
            },
        ]
    }
    else if (type == 'quadTank') {
        this.bulletR = 6;
        this.guns = [
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 0
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 1.55
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: Math.PI
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: -1.55
            }
        ]
    }
    else if (type == 'octoTank') {
        this.bulletR = 6;
        this.guns = [
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: -1.55
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: -1.55*1.5
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: -1.55/2
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 0
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 1.55/2
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 1.55
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: 1.55*1.5
            },
            {
                x: 0,
                y: -this.r/2,
                width: 30,
                height: 10,
                angle: Math.PI
            }
        ]
    }
    else if (type == 'tripleshot') {
        this.bulletR = 7;
        this.guns = [
            {
                x: 0,
                y: -this.r+1,
                width: 20,
                height: 8,
                angle: -.5
            },
            {
                x: 0,
                y: this.r/2-5,
                width: 20,
                height: 8,
                angle: .5
            },
            {
                x: 0,
                y: -this.r/2,
                width: 25,
                height: 8,
                angle: 0
            },
        ]
    }
    else if (type == 'twinHawk') {
        this.bulletR = 7;
        this.guns = [
            {
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
            },
        ]
    }
    else if (type == 'triple') {
        let h = 6;
        this.guns = [
            {
                x: 0,
                y: -h-3,
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
                y: h-3,
                width: 25,
                height: h,
                angle: 0
            },
        ]
    }
    else if (type == 'pentashot') {
        this.bulletR = 7;
        this.guns = [
            {
                x: 0,
                y: -this.r+1,
                width: 20,
                height: 8,
                angle: -.35
            },
            {
                x: 0,
                y: this.r/2-5,
                width: 20,
                height: 8,
                angle: .35
            },
            {
                x: 0,
                y: -this.r/2,
                width: 22,
                height: 8,
                angle: .2
            },
            {
                x: 0,
                y: -this.r/2,
                width: 22,
                height: 8,
                angle: -.2
            },
            {
                x: 0,
                y: -this.r/2,
                width: 25,
                height: 8,
                angle: 0
            },
        ]
    }
    else return;
    this.className = type;
    this.classPath.push(type);
}