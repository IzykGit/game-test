import { Attack } from "../actors/Attack.js";

export class Player {
    constructor(x, y, width, height, color, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.color = color;

        this.ctx = ctx;

        this.velocityY = 0;
        this.velocityX = 0;

        this.playerScore = 0;

        this.playerHealth = 100;

        this.hasSpawned = false;

        this.projectileAmmo = 10;
        this.bombAmmo = 5;

        this.currentTime = 0

        this.currentTime = 0;

        this.lastProjectileInterval = 0;
        this.lastBombInterval = 0;

        this.projectileAmmoInterval = 900;
        this.bombAmmoInterval = 1000;
    }

    addPoints(points) {
        this.playerScore += points;
    }

    takeDamage(damage) {
        if(this.playerHealth <= 0) return;
        this.playerHealth -= damage;
    }

    projectileAttack(direction, selectedAttack) {
        if(this.projectileAmmo <= 0) return

        this.projectileAmmo -= 1;
        const attack = new Attack(this.x, this.y + 15, direction, selectedAttack, this.ctx);
        return attack;
    }

    bombAttack(direction, selectedAttack) {
        if(this.bombAmmo <= 0) return

        this.bombAmmo -= 1;
        const attack = new Attack(this.x, this.y + 15, direction, selectedAttack, this.ctx);
        return attack;
    }


    addProjectileAmmo() {
        if(this.currentTime - this.lastProjectileInterval >= this.projectileAmmoInterval && this.projectileAmmo < 10) {
            this.projectileAmmo += 1;

            this.lastProjectileInterval = this.currentTime;
        }
    }

    addBombAmmo() {
        if(this.currentTime - this.lastBombInterval >= this.bombAmmoInterval && this.bombAmmo < 5) {
            this.bombAmmo += 1;
            this.lastBombInterval = this.currentTime;
        }
    }


    drawHealthBar() {
        const barWidth = 250;
        const barHeight = 25;
        const healthPercentage = this.playerHealth / 100;

        this.ctx.fillStyle = "red";
        this.ctx.fillRect(50, 50, barWidth, barHeight);

        this.ctx.fillStyle = "green";
        this.ctx.fillRect(50, 50, barWidth * healthPercentage, barHeight);
    }


    updatePlayer(currentTime) {
        this.currentTime = currentTime;
        this.addProjectileAmmo();
        this.addBombAmmo();

        this.drawHealthBar();
    }
}