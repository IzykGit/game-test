export class Projectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.damage = 20;

        this.type = "projectile"

        this.width = 20;
        this.height = 15;
        this.velocityY = 0;
        this.velocityX = 20;
    }
}