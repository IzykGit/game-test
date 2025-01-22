import { HandleGameActors } from "./HandleGameActors.js";
import { PowerUps } from "./PowerUps.js";


export class SpawnActors extends HandleGameActors {
    constructor(player, canvas, ctx) {
        super(player, canvas, ctx);
        this.player = player;
    }

    
    spawnEnemy() {
        if(this.player.playerScore === 0) {
            this.addEnemy(new Enemy(this.player.x, this.player.y, 20, 40, "red"))
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