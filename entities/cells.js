module.exports = function () {
    for (let j = 0, len = cells.length; j < len; j++) {
        let i = cells[j];
        if (i.dead) {
            i.scale += .1;
            if (i.scale >= 2)
                cells.splice(j, 1);
                len--;
            continue;
        }
        else if (i.type == 'attacker') {
            i.attack();
        }
        if (i.health < i.maxHealth) {
            regen(i);
        }
        i.recalculate();
    }
}