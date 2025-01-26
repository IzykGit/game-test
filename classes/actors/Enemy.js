export class Enemy {
    constructor(x, y, enemyType) {
        
        this.x = x;
        this.y = y;

        const { type, health, damage, speed, width, height, pointValue, color } = enemyType;

        this.type = type;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.speed = speed;
        this.pointValue = pointValue;

        this.width = width;
        this.height = height;

        this.color = color;

        this.velocityY = 0;
        this.velocityX = 0;

        this.lastAttackTime = 0;
    }


    takeDamage(damage) {
        this.health -= damage;
    }


    drawHealthBar(ctx) {
        const barWidth = this.width * 2;
        const barHeight = 10;
        const healthPercentage = this.health / this.maxHealth;

        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width / 2, this.y - 25, barWidth, barHeight);

        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.width / 2, this.y - 25, barWidth * healthPercentage, barHeight);
    }
}