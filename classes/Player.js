import { collisionCheck } from "../scripts/Collisions.js";

export class Player {
    constructor(x, y, width, height, color, mass) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mass = mass;
        this.color = color;

        this.velocityY = 0;
        this.velocityX = 0;
        this.canJump = true;
        this.gravityConstant = 0.93;
        this.friction = 0.75;

        this.playerHealth = 100;

        this.hasCollided = false;

        this.jumpAudio = new Audio('../sounds/jump.wav')
    }

    drawPlayer(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    drawHealthBar(ctx) {
        const barWidth = 150; 
        const barHeight = 15; 
        const healthPercentage = this.playerHealth / 100;

        ctx.fillStyle = "red"; 
        ctx.fillRect(50, 50, barWidth, barHeight);

        ctx.fillStyle = "green"; 
        ctx.fillRect(50, 50, barWidth * healthPercentage, barHeight);
    }

    applyGravity(canvas) {
        this.velocityY += this.gravityConstant;
        this.y += this.velocityY;
   

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    }
    

    applyInertia(canvas) {
        this.x += this.velocityX;


        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width - this.width;
            this.velocityX = 0;
        }
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }

        this.velocityX *= this.friction;
    }


    handleCollide(collidingWith) {
        for (const entity of collidingWith) {
            const collideState = collisionCheck(this, entity);
            switch (collideState) {
                case 1:
                    this.x = entity.x + entity.width;
                    this.velocityX = Math.abs(this.velocityX) + 20;
                    this.velocityY = Math.abs(this.velocityY) - 5;
                    this.velocityX *= this.friction;
                    this.hasCollided = true;
                    break;
    
                case 2:
                    this.x = entity.x - this.width;
                    this.velocityX = -(Math.abs(this.velocityX) + 20);
                    this.velocityY = Math.abs(this.velocityY) - 5;
                    this.velocityX *= this.friction;
                    this.hasCollided = true;

                    break;
    
                case 4: 
                    this.y = entity.y - this.height; 
                    this.velocityY = 0;
                    break;
    
                case 3:
                    this.y = entity.y + entity.height;
                    this.velocityY = 0;
                    break;
    
                default:
                    break;
            }
        }
    }

    jump() {
        if (this.canJump && this.velocityY === 0) {
            this.jumpAudio.play(); 
            this.velocityY = -10; 
            this.canJump = false; 
        }
    }

    move(keys, canvas) {
        const step = 5;

        if (keys["a"] || keys["A"]) {
            this.x -= step;
            this.velocityX = -10;
            
        }
        if (keys["d"] || keys["D"]) {
            this.x += step;
            this.velocityX = 10;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    };
    
}