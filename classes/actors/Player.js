
export class Player {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.color = color;

        this.velocityY = 0;
        this.velocityX = 0;

        this.playerScore = 0;

        this.playerHealth = 100;

        this.hasSpawned = false;

        this.selectedAttack = "projectile";
    }


    drawHealthBar(ctx) {
        const barWidth = 250;
        const barHeight = 25;
        const healthPercentage = this.playerHealth / 100;

        ctx.fillStyle = "red";
        ctx.fillRect(50, 50, barWidth, barHeight);

        ctx.fillStyle = "green";
        ctx.fillRect(50, 50, barWidth * healthPercentage, barHeight);
    }

}