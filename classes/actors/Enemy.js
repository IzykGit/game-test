export class Enemy {
    constructor(x, y, enemyType) {
        
        this.x = x;
        this.y = y;

        const { type, health, damage, speed, width, height, pointValue, color } = enemyType;

        this.type = type;
        this.health = health;
        this.damage = damage;
        this.speed = speed;
        this.pointValue = pointValue;

        this.width = width;
        this.height = height;

        this.color = color;

        this.velocityY = 0;
        this.velocityX = 0;
    }


    takeDamage(damage) {
        this.health -= damage;
    }
}