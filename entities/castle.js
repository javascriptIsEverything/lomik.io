module.exports = class Castle {
    constructor () {
        this.side = 50;
        this.health = 30;
        this.maxHealth = 30;
        this.bodyDamage = 3;
        this.lastDamaged = 0;
        this.aliveFrom = 0;
        this.lastedUntill = null;
        this.regeneration = {
            speed: .2,
            delay: 12e3, // ! 12e4 bdi exni
        };
        this.x = 300;
        this.y = 300;
    }
};