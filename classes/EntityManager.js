import { getPlayer } from "../global/PlayerValues.js";
import { getDamageSound } from "../scripts/Audio.js";
import { isColliding } from "../scripts/Collisions.js";
import { applyGravity } from "../scripts/Gravity.js";

const player = getPlayer();

export class EntityManager {
    constructor () {
        this.enemies = [];
        this.projectiles = [];
        this.powerUpsOnGround = [];

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

    updateEntities() {
        applyGravity([player, ...this.enemies])
        this.detectProjectileCollisions()
    }
}