class LevelTile {
    constructor(x, y, mass, color, type) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.color = color;
        this.type = type;

        this.velocityY = 0;
        this.velocityX = 0;
        this.width = 32;
        this.height = 32;
        this.gravityConstant = 0.93;

    }


    drawTile(ctx) {
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
}