export class Enemy {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.color = color;

        this.width = width;
        this.height = height;

        this.type = type;

        this.health = 100;

        this.velocityY = 0;

        this.speed = 4;

    }


    // moves enemy in the direction of the player
    move(playerX, playerY, playerWidth) {
        const dx = (playerX + playerWidth) - (this.x + 1);
        const dy = playerY - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0 && this.velocityY === 0) {
            this.x += (dx / distance) * this.speed;

        }
    }

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }
}