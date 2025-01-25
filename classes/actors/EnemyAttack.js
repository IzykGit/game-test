
export class EnemyAttack {
    constructor(x, y, direction, damage) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.damage = damage;

        this.width = 15;
        this.height = 15;



        this.color = "grey"

        this.speed = 600;

        this.velocityX = 0;
        this.velocityY = 0;
    }


}