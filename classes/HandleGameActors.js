import { getPlayer } from "../global/PlayerValues.js";
import { getDamageSound } from "../scripts/Audio.js";
import { isColliding } from "../scripts/Collisions.js";
import { applyGravity } from "../scripts/Gravity.js";
import { PowerUps } from "./PowerUps.js";
import { Projectile } from "./Projectile.js";

const player = getPlayer();

export class HandleGameActors {
    constructor (canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];
        
        
        this.frictionConstant = 0.75;
        this.gravityConstant = 0.93;
    }

    addEnemy(enemy) {
        this.enemies.push(enemy)
    }


    addProjectile() {
        const projectile = new Projectile();
        this.projectiles.push(projectile);
    }


    applyGravity = () => {
        for(let i = 0; i < entities.length; i++) {
            this.entities[i].velocityY += gravityConstant;
            this.entities[i].y += this.entities[i].velocityY;
        
        
            if (this.entities[i].y + this.entities[i].height >= this.this.canvas.height) {
                this.entities[i].y = this.this.canvas.height - this.entities[i].height;
                this.entities[i].velocityY = 0;
            }
        }
    }


    applyInertia() {

        for(let i = 0; i < this.entites.length; i++) {
            this.entities[i].x += this.velocityX;

            if (this.entities[i].x + this.width >= this.canvas.width) {
                this.entities[i].x = this.canvas.width - this.width;
                this.velocityX = 0;
            }
            if (this.entities[i].x < 0) {
                this.entities[i].x = 0;
                this.velocityX = 0;
            }
    
            this.velocityX *= this.friction;
        }
    }
    


    detectProjectileCollisions = () => {
        if (this.projectiles.length > 0 && this.enemies.length > 0) {
            for (let i = 0; i < this.enemies.length; i++) {
                for (let j = 0; j < this.projectiles.length; j++) {
                    if (isColliding(this.enemies[i], this.projectiles[j])) {        
                        this.enemies[i].health -= this.projectiles[j].damage;
                        getDamageSound().currentTime = 0;
                        getDamageSound().play();
                        this.projectiles.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }



    handlePowerUpCollisions = () => {
        if (this.powerUps.length === 0) return;
    
        const player = getPlayer();
    
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
    
            const powerUp = this.powerUps[i];

        
            if (isColliding(player, powerUp)) {
                if(powerUp.type === "health") {
                    player.playerHealth += 20;
                }
                this.powerUps.splice(i, 1);
            }
        }
    };

    updatePowerUps = () => {    
        if (this.powerUps.length > 0) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                
                const powerUp = this.powerUps[i];

                powerUp.draw(ctx);
                powerUp.applyGravity(this.canvas);
        
                if (this.powerUps[i].y > this.canvas.height) {
                    powerUp.splice(i, 1);
                }
            }
        }
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
        this.powerUps.push(powerUp);
    }

    updateEntities() {
        applyGravity([player, ...this.enemies]);
        this.detectProjectileCollisions();
        this.updatePowerUps();
        this.handlePowerUpCollisions();
    }
}