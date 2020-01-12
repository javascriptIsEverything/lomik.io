const Health = {
    timer: null,
    restartRegeneration () {        
        let regeneration = this.regeneration;
        regeneration.started = false;
        regeneration.waiting = true;
        
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            regeneration.waiting = false;
            regeneration.started = true;
        }, regeneration.delay);
    },
    draw() {
        if (this.dead) return;
            x = this.x,
            y = this.y,
            w = this.w || this.r*2,
            h = this.h || this.r*2;
        
        let width, wholeWidth = w+8;
        if (this.maxHealth != this.health) {
            let regeneration = this.regeneration;
            if (regeneration.started) {
                regeneration.waiting = false;
                this.health += regeneration.speed;
                if (this.health > this.maxHealth) {
                    this.health = this.maxHealth;
                    regeneration.started = false;
                }
            }
            else if (!regeneration.started && !regeneration.waiting) {        
                regeneration.started = false;
                regeneration.waiting = true;
                
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    regeneration.waiting = false;
                    regeneration.started = true;
                }, regeneration.delay);
            }

            let percent = this.health * 100 / this.maxHealth;
            width = wholeWidth * percent / 100;
        }
        else width = wholeWidth;

        ctx.fillStyle = '#000';
        ctx.fillRect(x-w/2-5, y + h+3, w+10, 5);
        ctx.fillStyle = 'lime';
        ctx.fillRect(x-w/2-4, y + h+4, width, 3);
    }
};