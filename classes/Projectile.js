export class Projectile {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;

        this.damage = 20;

        this.type = "projectile"

        this.width = 20;
        this.height = 15;
        this.velocityY = 0;
        this.velocityX = 20;
    }

    drawProjectile(ctx) {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    accelerate() {
        if (this.direction === 1) {
            this.x += this.velocityX;
        }
        else  {
            this.x -= this.velocityX;
        }
    }
}