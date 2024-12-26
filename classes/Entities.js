import { collisionCheck } from "../scripts/Collisions.js";

export class Entity {
    constructor(x, y, width, height, color, isSolid = true) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.isSolid = isSolid;


        this.health = 100;

        this.velocityY = 0;
        this.gravityConstant = 0.5;

        this.speed = 5;

        this.deathAudio = new Audio("../sounds/enemyDeath.wav")
    }

    move(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && this.velocityY === 0) {
            this.x += (dx / distance) * this.speed;

        }
    }

    applyGravity(canvas) {
        this.velocityY += this.gravityConstant;
        this.y += this.velocityY;
   

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    }


    handleCollide(entity) {
        const collideState = collisionCheck(this, entity);

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