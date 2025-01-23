
export class Attack {
    constructor(x, y, direction, selectedAttack) {
        this.x = x;
        this.y = y;
        this.direction = direction;

        const { type, damage, speed, color, width, height } = selectedAttack;

        this.type = type;
        this.damage = damage;
        this.speed = speed;
        this.color = color;
        this.width = width;
        this.height = height;

        this.velocityX = 0;
        this.velocityY = 0;

        // this is for bomb physics
        this.timer = 5000;
        this.isThrown = false;
    }



}