import { collidingSide, isColliding } from "../scripts/CollisionFunctions.js";


export class Collisions {
    constructor(gameState, canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attacksArr, powerUps } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attacksArr = attacksArr;
        this.powerUps = powerUps;

    }

    handleEnemyOnEnemy() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                if (isColliding(this.enemies[i], this.enemies[j])) {
                    const collideState = collidingSide(this.enemies[i], this.enemies[j]);

                    switch (collideState) {
                        case "left":
                            this.enemies[i].x = this.enemies[j].x + this.enemies[j].width;
                            break;
                        case "right":
                            this.enemies[i].x = this.enemies[j].x - this.enemies[i].width;
                            break;
                        case "top":
                            this.enemies[i].y = this.enemies[j].y + this.enemies[j].height;
                            this.enemies[i].velocityY = 0;
                            break;
                        case "bottom":
                            this.enemies[i].y = this.enemies[j].y - this.enemies[i].height;
                            this.enemies[i].velocityY = 0;
                    }
                }
            }
        }
    }

    handlePlayerOnEnemyCollisions() {

        for (let i = 0; i < this.enemies.length; i++) {
            if (isColliding(this.player, this.enemies[i])) {
                const collideState = collidingSide(this.player, this.enemies[i]);

                switch (collideState) {
                    case "left":
                        this.player.x = this.enemies[i].x + this.enemies[i].width;
                        this.player.velocityX = 0;
                        break;
                    case "right":
                        this.player.x = this.enemies[i].x - this.player.width;
                        this.player.velocityX = 0;
                        break;
                    case "top":
                        this.player.y = this.enemies[i].y + this.enemies[i].height;
                        this.player.velocityY = 0;
                        break;
                    case "bottom":
                        this.player.y = this.enemies[i].y - this.player.height;
                        this.player.velocityY = 0;
                }
            }
        }
    }

    handlAttackCollisions() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            for (let j = this.attacksArr.length - 1; j >= 0; j--) {
                if (isColliding(this.enemies[i], this.attacksArr[j])) {
                    this.enemies[i].health -= this.attacksArr[j].damage;
                    this.attacksArr.splice(j, 1);

                    if(this.enemies[i].health <= 0) {
                        this.enemies.splice(i, 1)
                        i--
                    }

                    break;
                }
            }
        }
    }



    handlePowerUpCollisions() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            if (isColliding(this.player, this.powerUps[i])) {
                switch (powerUps[i].type) {
                    case "health":
                        this.player.playerHealth += 20;
                        break;
                    default:
                        break;
                }

                this.powerUps.slice(i, 1)
            }
        }
    };


    updateCollisions() {
        this.handlAttackCollisions();
        this.handleEnemyOnEnemy();
        this.handlePlayerOnEnemyCollisions();
        this.handlePowerUpCollisions();
    }

}