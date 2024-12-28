
export class PowerUps {
    constructor(x, y, type, color) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;

        this.width = 30;
        this.height = 30;

        this.velocityY = 0;
        this.gravityConstant = 0.93;

    }

    draw(ctx) {
        console.log("drawing power up");
    

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    

        ctx.strokeStyle = "black"; 
        ctx.lineWidth = 2; 
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    applyGravity(canvas) {
        this.velocityY += this.gravityConstant;
        this.y += this.velocityY;
   

        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY = 0;
        }
    }
}