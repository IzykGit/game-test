export class Projectiles {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;

        this.damage = 20;

        this.color = "grey"

        this.width = 15;
        this.height = 15;
        this.velocityX = 0;
    }
}