import { EnemyAttack } from "../actors/EnemyAttack.js";


export class EnemyHandler {
    constructor(gameState, canvas, ctx) {

        this.gameState = gameState;
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attackArr, powerUps, enemyAttacksArr } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attackArr = attackArr;
        this.powerUps = powerUps;
        this.enemyAttacksArr = enemyAttacksArr;


        this.currentTime = 0;
        this.lastInterval = 0;
        this.archerAttackInterval = 4000;
    }


    updateGruntMovement() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].type === "grunt") {
                const dx = (this.player.x + this.player.width) - (this.enemies[i].x + 1);
                const dy = this.player.y - this.enemies[i].y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0 && this.enemies[i].velocityY === 0) {
                    this.enemies[i].x += (dx / distance) * this.enemies[i].speed;

                }
            }
        }
    }

    updateArcherMovement() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if(this.enemies[i].type !== "archer") return;
            if (this.currentTime - this.lastInterval >= this.archerAttackInterval && this.enemies[i].y + this.enemies[i].height === this.canvas.height) {

                let direction;

                if (this.player.x < this.enemies[i].x) {
                    direction = 1;
                }
                else {
                    direction = 2;
                }

                this.gameState.addEnemyAttack(new EnemyAttack(this.enemies[i].x, this.enemies[i].y + 5, direction))
                this.lastInterval = this.currentTime;
            }
        }
    }


    updatePathfinding(currentTime) {
        this.updateGruntMovement();
        this.updateArcherMovement();

        this.currentTime = currentTime;
    }
}