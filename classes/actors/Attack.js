
export class Attack {
    constructor(x, y, direction, selectedAttack, ctx) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.ctx = ctx;

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
        this.timer = 100;
        this.isThrown = false;
        this.rotationValue = 0;
    }


    drawBombTimer() {
        const bombTimePercentage = this.timer / 100
        const timeBarWidth = 50;

        if(this.timer > 0) {
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(this.x - this.width / 2, this.y - 15, timeBarWidth * bombTimePercentage, 10);
        }   
    }
}