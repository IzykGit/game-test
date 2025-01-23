import { Attack } from "./Attack.js";
import { Enemy } from "./Enemy.js";

export class GameState {
    constructor (player, canvas, ctx) {
        this.player = player
        this.canvas = canvas;
        this.ctx = ctx;
      
        this.enemies = [];
        this.attacksArr = [];
        this.powerUps = [];  
                


        this.deltaTime = 0;

        this.eventBus = new EventTarget();
    }
    

    addEnemy() {
        this.enemies.push(new Enemy(this.player.x, this.player.y, 20, 40, "red"))
    }

    addAttack(direction) {
        this.attacksArr.push(new Attack(this.player.x, this.player.y + 15, direction));
    }

    addPowerUp(powerUp) {
        this.powerUps.push(powerUp)
    }
    

    updatePowerUps() {    
        if (this.powerUps.length > 0) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {        
                if (this.powerUps[i].y > this.canvas.height) {
                    this.powerUps.splice(i, 1);
                }
            }
        }
    }

    updateEnemyMovement() {
        const speed = 2.5;

        for(let i = 0; i < this.enemies.length; i++) {
            const dx = (this.player.x + this.player.width) - (this.enemies[i].x + 1);
            const dy = this.player.y - this.enemies[i].y;
    
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0 && this.enemies[i].velocityY === 0) {
                this.enemies[i].x += (dx / distance) * speed;
    
            }
        }
    }

    drawActors() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)

        for(let i = 0; i < this.enemies.length; i++) {
            this.ctx.fillStyle = this.enemies[i].color;
            this.ctx.fillRect(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
        }

        for(let i = 0; i < this.powerUps.length; i++) {
            this.ctx.fillStyle = this.powerUps[i].color;
            this.ctx.fillRect(this.powerUps[i].x, this.powerUps[i].y, this.powerUps[i].width, this.powerUps[i].height)
        }

        for(let i = 0; i < this.attacksArr.length; i++) {
            this.ctx.fillStyle = this.attacksArr[i].color;
            this.ctx.fillRect(this.attacksArr[i].x, this.attacksArr[i].y, this.attacksArr[i].width, this.attacksArr[i].height);
        }
    }




    updateActors() {
        this.drawActors();
    }
}