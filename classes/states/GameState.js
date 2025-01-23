import { Attack } from "../actors/Attack.js";
import { Enemy } from "../actors/Enemy.js";

export class GameState {
    constructor(player, canvas, ctx) {
        this.player = player
        this.canvas = canvas;
        this.ctx = ctx;

        this.enemies = [];
        this.attacksArr = [];
        this.powerUps = [];

        this.attackTypes = this.getAttackTypes();
        this.enemyTypes = this.getEnemyTypes();
        this.powerUpTypes = {};

        this.selectedAttack = {};

        this.init();

        this.deltaTime = 0;

        this.eventBus = new EventTarget();
    }


    addEnemy() {
        this.enemies.push(new Enemy(this.player.x, this.player.y, 20, 40, "red"))
    }

    addAttack(direction) {
        if (!this.selectedAttack) {
            this.updateSelectedAttack()
        }

        const attack = new Attack(this.player.x, this.player.y + 15, direction, this.selectedAttack);
        this.attacksArr.push(attack);
    }

    addPowerUp(powerUp) {
        this.powerUps.push(powerUp)
    }


    async init() {
        await this.getAttackTypes();
        await this.getEnemyTypes();
        // await this.getPowerUpTypes();

        this.initializeAttackSelection();
    }

    initializeAttackSelection() {
        if (!this.attackTypes || Object.keys(this.attackTypes).length === 0) {
            return;
        }

        const attackKeys = Object.keys(this.attackTypes);

        if (!this.selectedAttack.typeKey) {
            const firstKey = attackKeys[0];
            this.selectedAttack = {
                typeKey: firstKey,
                ...this.attackTypes[firstKey]
            };
            return;
        }
    }

    updateSelectedAttack() {
        const attackKeys = Object.keys(this.attackTypes);

        if (!this.selectedAttack.typeKey) {
            this.initializeAttackSelection();
            return;
        }

        const currentIndex = attackKeys.findIndex(key => key === this.selectedAttack.typeKey);

        const newIndex = (currentIndex + 1) % attackKeys.length;
        const newKey = attackKeys[newIndex];

        this.selectedAttack = {
            typeKey: newKey,
            ...this.attackTypes[newKey]
        };

        console.log(this.selectedAttack)
    }


    async getAttackTypes() {
        const response = await fetch("../configs/attacks.json");
        this.attackTypes = await response.json();
    }

    async getEnemyTypes() {
        const response = await fetch("../configs/enemies.json");
        this.enemyTypes = await response.json()
    }

    // async getPowerUpTypes () {
    //     const response = await fetch("../configs/powerUps.json");
    //     this.powerUpTypes = await response.json()
    // }

    drawActors() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)

        for (let i = 0; i < this.enemies.length; i++) {
            this.ctx.fillStyle = this.enemies[i].color;
            this.ctx.fillRect(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
        }

        for (let i = 0; i < this.powerUps.length; i++) {
            this.ctx.fillStyle = this.powerUps[i].color;
            this.ctx.fillRect(this.powerUps[i].x, this.powerUps[i].y, this.powerUps[i].width, this.powerUps[i].height)
        }

        for (let i = 0; i < this.attacksArr.length; i++) {
            this.ctx.fillStyle = this.attacksArr[i].color;
            this.ctx.fillRect(this.attacksArr[i].x, this.attacksArr[i].y, this.attacksArr[i].width, this.attacksArr[i].height);
        }
    }




    updateActors() {
        this.drawActors();
    }
}