export class Projectile {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;

        this.width = 20;
        this.height = 15;
        this.velocityY = 0;
        this.velocityX = 30;
    }

    drawProjectile(ctx) {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    accelerate() {
        this.x += this.velocityX;
    }
}