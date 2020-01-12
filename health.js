module.exports = class Health {
    constructor (obj) {
        this.obj = obj;
        this.timer = null;
        this.delayPassed = false;
    }
    restartRegeneration () {        
        let regeneration = this.obj.regeneration;
        regeneration.started = false;
        regeneration.waiting = true;
        
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            regeneration.waiting = false;
            regeneration.started = true;
        }, regeneration.delay);
    }
    draw() {
        if (this.obj.dead) return;
        let obj = this.obj,
            x = obj.x,
            y = obj.y,
            w = obj.w || obj.r*2,
            h = obj.h || obj.r*2;
        
        let width, wholeWidth = w+8;
        if (obj.maxHealth != obj.health) {
            let regeneration = obj.regeneration;
            if (regeneration.started) {
                regeneration.waiting = false;
                obj.health += regeneration.speed;
                if (obj.health > obj.maxHealth) {
                    obj.health = obj.maxHealth;
                    regeneration.started = false;
                }
            }
            else if (!regeneration.started && !regeneration.waiting) {
                // console.log(1);
                this.restartRegeneration();
            }

            let percent = obj.health * 100 / obj.maxHealth;
            width = wholeWidth * percent / 100;
        }
        else width = wholeWidth;

        ctx.fillStyle = '#000';
        ctx.fillRect(x-w/2-5, y + h+3, w+10, 5);
        ctx.fillStyle = 'lime';
        ctx.fillRect(x-w/2-4, y + h+4, width, 3);
    }
}