import { PowerUps } from "../actors/PowerUps.js";

export class SpawnActors {
    constructor(gameState, canvas, ctx) {
        this.gameState = gameState;
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attackArr, powerUps } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attackArr = attackArr;
        this.powerUps = powerUps;

        this.currentTime = 0; 
        this.lastSpawnTime = 0; 
        this.enemySpawnInterval = 2000; 
    }

    spawnEnemy() {
        this.gameState.addEnemy();
    }

    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
        this.powerUps.push(powerUp); 
    }

    spawnUpdate(currentTime) {
        this.currentTime = currentTime;


        if (this.currentTime - this.lastSpawnTime >= this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastSpawnTime = this.currentTime; 
        }
    }
}
