import { Enemy } from "../actors/Enemy.js";
import { PowerUps } from "../actors/PowerUps.js";


export class SpawnActors{
    constructor(gameState, canvas, ctx) {
        this.gameState = gameState;
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attackArr, powerUps } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attackArr = attackArr;
        this.powerUps = powerUps;
    }

    
    spawnEnemy() {
        if(this.player.playerScore === 0 && this.enemies.length === 0) {
            this.gameState.addEnemy()
        }
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
    }


    spawnUpdate() {
        this.spawnEnemy();
    }
}