import { HandleGameActors } from "./HandleGameActors.js";
import { Projectiles } from "./Projectiles.js";
import { PowerUps } from "./PowerUps.js";


export class SpawnActors extends HandleGameActors {
    constructor(player) {
        super();
        this.player = player;
        this.eventBus = new EventTarget();

    }

    updateInterval() {
    
        if (enemySpawnInterval >= 1000) {
            return enemySpawnInterval -= player.playerScore;
        }
    
        if (spawnNumber === 4) {
            return;
        }
        else {
            return spawnNumber += 1;
        }
    }

    spawnProjectile() {
        const projectile = new Projectiles(this.player.x, this.player.y + 15);
        this.addProjectile(projectile);
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
        this.addPowerUp(powerUp);
    }


    spawnUpdate() {

    }
}