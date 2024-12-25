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
        this.gravityConstant = 0.93;

        this.jumpAudio = new Audio('../sounds/jump.wav')
    }

    drawPlayer(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    applyGravity(canvas) {
        this.velocityY += this.gravityConstant;
        this.y += this.velocityY;

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    };

    move(keys, canvas) {
        const step = 10;
        if(keys[" "]) {
            if (this.y + this.height >= canvas.height) {
                this.jumpAudio.play()
                this.velocityY -= 10;
            }
        }

        if (keys["a"] || keys["A"]) {
            this.x -= step;
        }
        if (keys["d"] || keys["D"]) {
            this.x += step;
        }

        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    };
    
}