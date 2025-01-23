export class Enemy {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        this.width = width;
        this.height = height;

        this.health = 100;

        this.velocityY = 0;
        this.velocityX = 0;
    }

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }
}