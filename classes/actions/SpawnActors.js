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

        this.currentTime = 0;
        this.intervalTime = 0;
    }

    updateTimeInterval() {

    }
    
    spawnEnemy() {
        if(this.currentTime % 6000 === 0) {
            this.gameState.addEnemy()
        }
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
    }


    spawnUpdate(currentTime) {
        this.spawnEnemy();

        

        this.currentTime = currentTime;
    }
}