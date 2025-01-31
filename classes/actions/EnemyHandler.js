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

        this.deltaTime = 0;

        this.currentTime = 0;
        this.lastInterval = 0;
        this.archerAttackInterval = 4000;
    }


    updateMovement() {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].type !== "archer") {
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
            if(this.enemies[i].type === "archer") {
                const enemy = this.enemies[i];

                if (enemy.lastAttackTime === undefined) {
                    enemy.lastAttackTime = 0;
                }
    
                if (this.currentTime - enemy.lastAttackTime >= this.archerAttackInterval &&
                    enemy.y + enemy.height === this.canvas.height) {
    
                    let direction = this.player.x < enemy.x ? 1 : 2;
    
                    this.gameState.addEnemyAttack(new EnemyAttack(enemy.x, enemy.y + 5, direction, this.enemies[i].damage));
                    enemy.lastAttackTime = this.currentTime;
                }
            }
        }
    }


    updatePathfinding(currentTime, deltaTime) {
        this.currentTime = currentTime;
        this.deltaTime = deltaTime;
        this.updateMovement();
        this.updateArcherMovement();
    }
}