import { collisionCheck } from "../scripts/Collisions.js";

export class Enemy {
    constructor(x, y, width, height, color, type, isSolid = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSolid = isSolid;

        this.type = type;

        this.health = 100;

        this.velocityY = 0;

        this.speed = 4;

    }

    move(playerX, playerY, playerWidth) {
        const dx = (playerX + playerWidth) - (this.x + 1);
        const dy = playerY - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && this.velocityY === 0) {
            this.x += (dx / distance) * this.speed;

        }
    }

    handleCollide(entity) {
        const collideState = collisionCheck(this, entity);

            if(entity.type === "projectile") {
                this.health -= entity.damage;
                return;
            }

            switch(collideState) {
                case 1:
                    this.x = entity.x + entity.width;
                    break;
                case 2:
                    this.x = entity.x - this.width;
                    break;
                case 3:
                    this.y = entity.y + entity.height; 
                    this.velocityY = 0;
                    break;
                case 4:
                    this.y = entity.y - this.height; 
                    this.velocityY = 0; 
            }
    }
    

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }
}