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
    }

    move(dx = 0, dy = 0) {
        this.x += dx;
        this.y += dy; 
    }

    applyGravity(canvas) {
        this.velocityY += this.gravityConstant;
        this.y += this.velocityY;
   

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    }


    handleCollide(collidingWith) {
        for (const entity of collidingWith) {
            const collideState = collisionCheck(this, entity);

            if (collideState === 4) { 
                this.y = entity.y - this.height; 
                this.velocityY = 0; 
            }

            else if (collideState === 3) { 
                this.y = entity.y + entity.height; 
                this.velocityY = 0; 
            }
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