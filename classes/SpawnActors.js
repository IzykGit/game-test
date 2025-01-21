import { HandleGameActors } from "./HandleGameActors.js";
import { PowerUps } from "./PowerUps.js";


export class SpawnActors extends HandleGameActors {
    constructor(player, canvas, ctx) {
        super(player, canvas, ctx);
        this.player = player;
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



    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
        this.addPowerUp(powerUp);
    }


    spawnUpdate() {

    }
}