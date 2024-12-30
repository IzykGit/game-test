import { getPlayer } from "../global/PlayerValues.js";
import { canvas, ctx } from "../script.js";
import { getDamageSound } from "../scripts/Audio.js";
import { isColliding } from "../scripts/Collisions.js";
import { applyGravity } from "../scripts/Gravity.js";
import { PowerUps } from "./PowerUps.js";

const player = getPlayer();

export class EntityManager {
    constructor () {
        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];

        if (EntityManager.instance) {
            return EntityManager.instance;
        }
        EntityManager.instance = this;
    
    }


    static getInstance() {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }

    addEnemy(enemy) {
        this.enemies.push(enemy)
    }


    addProjectile(projectile) {
        this.projectiles.push(projectile)
    }


    detectProjectileCollisions = () => {
        if (this.projectiles.length > 0 && this.enemies.length > 0) {
            for (let i = 0; i < this.enemies.length; i++) {
                for (let j = 0; j < this.projectiles.length; j++) {
                    if (
                        this.enemies[i].isSolid && 
                        isColliding(this.enemies[i], this.projectiles[j])
                    ) {        
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
                powerUp.applyGravity(canvas);
        
                if (this.powerUps[i].y > canvas.height) {
                    powerUp.splice(i, 1);
                }
            }
        }
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (canvas.width - 40);
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