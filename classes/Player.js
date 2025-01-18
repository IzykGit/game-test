import { collisionCheck } from "../scripts/Collisions.js";

export class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.color = color;

        this.velocityY = 0;
        this.velocityX = 0;
        this.canJump = true;

        this.playerScore = 0;



        this.playerHealth = 100;

        this.damageConstant = 10;

        this.playerDirection = 0;

        this.hasCollided = false;

        this.hasSpawned = false;
        
        this.jumpAudio = new Audio('../assets/sounds/jump.wav')
        this.damageAudio = new Audio('../assets/sounds/hitHurt.wav')
    }

    drawPlayer(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    drawHealthBar(ctx) {
        const barWidth = 250; 
        const barHeight = 25; 
        const healthPercentage = this.playerHealth / 100;

        ctx.fillStyle = "red"; 
        ctx.fillRect(50, 50, barWidth, barHeight);

        ctx.fillStyle = "green"; 
        ctx.fillRect(50, 50, barWidth * healthPercentage, barHeight);
    }


    takeDamage() {
        if (this.playerHealth > 0) {
            this.playerHealth -= this.damageConstant;
        }
        else {
            return;
        }
    }
    


    jump() {
        if (this.canJump && this.velocityY === 0) {
            this.jumpAudio.play(); 
            this.velocityY = -20; 
            this.canJump = false; 
        }
    }

    move(keys, canvas) {
        const step = 5;
        
        if (keys["a"] || keys["A"]) {
            this.playerDirection = 2;
            this.x -= step;
            this.velocityX = -10;
            
        }
        if (keys["d"] || keys["D"]) {
            this.playerDirection = 1;
            this.x += step;
            this.velocityX = 10;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    };
    
}