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
        this.enemyAttacksArr = [];

        this.attackTypes = {};
        this.enemyTypes = {};
        this.powerUpTypes = {};

        this.selectedAttack = {};

        this.init();

        this.deltaTime = 0;

        this.eventBus = new EventTarget();
    }


    addEnemy() {
        const randomXAxisPoints = Math.random() * (this.canvas.width - 40);
        const score = this.player.playerScore;

        console.log(score)

        const enemyKeys = Object.keys(this.enemyTypes);
        

        if(score > 1200) {
            const randomEnemy = Math.floor(Math.random() * 5)
            this.enemies.push(new Enemy(randomXAxisPoints, 0, {...this.enemyTypes[enemyKeys[randomEnemy]]}))
            return;
        }
        else if(score > 900) {
            const randomEnemy = Math.floor(Math.random() * 4)
            this.enemies.push(new Enemy(randomXAxisPoints, 0, {...this.enemyTypes[enemyKeys[randomEnemy]]}))
            return;
        }
        else if(score > 600) {
            const randomEnemy = Math.floor(Math.random() * 3)
            this.enemies.push(new Enemy(randomXAxisPoints, 0, {...this.enemyTypes[enemyKeys[randomEnemy]]}))
            return;
        }
        else if(score > 300) {
            const randomEnemy = Math.floor(Math.random() * 2)
            this.enemies.push(new Enemy(randomXAxisPoints, 0, {...this.enemyTypes[enemyKeys[randomEnemy]]}))
            return;
        }
        else {
            this.enemies.push(new Enemy(randomXAxisPoints, 0, {...this.enemyTypes[enemyKeys[0]]}))
            return;
        }
    }

    addAttack(direction) {
        if (!this.selectedAttack) {
            this.updateSelectedAttack()
        }

        const attack = new Attack(this.player.x, this.player.y + 15, direction, this.selectedAttack, this.ctx);
        this.attacksArr.push(attack);
    }

    addPowerUp(powerUp) {
        this.powerUps.push(powerUp)
    }

    addEnemyAttack(attack) {
        this.enemyAttacksArr.push(attack)
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
        this.ctx.strokeStyle = "black"
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)
        this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height)

        for (let i = 0; i < this.enemies.length; i++) {
            this.ctx.strokeStyle = "black"
            this.ctx.fillStyle = this.enemies[i].color;
            this.ctx.fillRect(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
            this.ctx.strokeRect(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
        }

        for (let i = 0; i < this.powerUps.length; i++) {
            this.ctx.strokeStyle = "black"
            this.ctx.fillStyle = this.powerUps[i].color;
            this.ctx.fillRect(this.powerUps[i].x, this.powerUps[i].y, this.powerUps[i].width, this.powerUps[i].height)
            this.ctx.strokeRect(this.powerUps[i].x, this.powerUps[i].y, this.powerUps[i].width, this.powerUps[i].height)
        }

        for (let i = 0; i < this.attacksArr.length; i++) {
            this.ctx.strokeStyle = "black"
            this.ctx.fillStyle = this.attacksArr[i].color;
            this.ctx.fillRect(this.attacksArr[i].x, this.attacksArr[i].y, this.attacksArr[i].width, this.attacksArr[i].height);
            this.ctx.strokeRect(this.attacksArr[i].x, this.attacksArr[i].y, this.attacksArr[i].width, this.attacksArr[i].height);

            if(this.attacksArr[i].type === "bomb") {
                this.attacksArr[i].drawBombTimer();
            }
        }

        for (let i = 0; i < this.enemyAttacksArr.length; i++) {
            this.ctx.strokeStyle = "black"
            this.ctx.fillStyle = this.enemyAttacksArr[i].color;
            this.ctx.fillRect(this.enemyAttacksArr[i].x, this.enemyAttacksArr[i].y, this.enemyAttacksArr[i].width, this.enemyAttacksArr[i].height)
            this.ctx.strokeRect(this.enemyAttacksArr[i].x, this.enemyAttacksArr[i].y, this.enemyAttacksArr[i].width, this.enemyAttacksArr[i].height)
        }
    }




    updateActors() {
        this.drawActors();
    }
}