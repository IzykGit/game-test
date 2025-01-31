import { Enemy } from "../actors/Enemy.js";
import { PowerUps } from "../actors/PowerUps.js";

export class SpawnActors {
    constructor(gameState, canvas, ctx) {
        this.gameState = gameState;
        this.canvas = canvas;
        this.ctx = ctx;

        const { player } = gameState;

        this.player = player;

        this.enemyTypes = {};

        this.init();

        this.currentTime = 0;
        this.lastSpawnTime = 0;
        this.enemySpawnInterval = 5000;
    }

    async getEnemyTypes() {
        const response = await fetch("../configs/enemies.json");
        this.enemyTypes = await response.json()
    }

    async init() {
        await this.getEnemyTypes();
    }

    spawnEnemy() {
        const randomXAxisPoints = Math.random() * (this.canvas.width - 40);
        const enemyKeys = Object.keys(this.enemyTypes);

        const randomEnemy = Math.floor(Math.random() * 4)
        const newEnemy = new Enemy(randomXAxisPoints, 0, { ...this.enemyTypes[enemyKeys[randomEnemy]] })
        this.gameState.addEnemy(newEnemy);
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
