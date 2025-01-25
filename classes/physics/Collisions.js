import { collidingSide, isColliding } from "../../scripts/CollisionFunctions.js";


export class Collisions {
    constructor(gameState, canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        const { player, enemies, attacksArr, powerUps, enemyAttacksArr } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attacksArr = attacksArr;
        this.powerUps = powerUps;
        this.enemyAttacksArr = enemyAttacksArr
    }

    handleEnemyOnEnemy() {

            // add small value to prevent overlap from floating point numbers
            const epsilon = 0.6;

        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                if (isColliding(this.enemies[i], this.enemies[j]) && this.enemies[i].type !== "bug" && this.enemies[j].type !== "bug") {
                    const collideState = collidingSide(this.enemies[i], this.enemies[j]);

                    switch (collideState) {
                        case "left":
                            this.enemies[i].x = this.enemies[j].x + this.enemies[j].width + epsilon;
                            break;
                        case "right":
                            this.enemies[i].x = this.enemies[j].x - this.enemies[i].width - epsilon;
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



    bugCrush(index) {
        this.enemies.splice(index, 1)
    }

    handlePlayerOnEnemyCollisions() {

        // add small value to prevent overlap from floating point numbers
        const epsilon = 0.6;



        for (let i = 0; i < this.enemies.length; i++) {
            if (isColliding(this.player, this.enemies[i])) {
                const collideState = collidingSide(this.player, this.enemies[i]);

                switch (collideState) {
                    case "left":
                        this.player.x = this.enemies[i].x + this.enemies[i].width + epsilon;
                        break;
                    case "right":
                        this.player.x = this.enemies[i].x - this.player.width - epsilon;
                        break;
                    case "top":
                        this.player.y = this.enemies[i].y + this.enemies[i].height + epsilon;
                        this.player.velocityY = 0;

                        break;
                    case "bottom":
                        this.player.y = this.enemies[i].y - this.player.height - epsilon;
                        this.player.velocityY = 0;

                        if(this.enemies[i].type === "bug") {
                            this.bugCrush(i)
                        }

                }
            }
        }
    }




    handlPlayerAttackCollisions() {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            for (let j = this.attacksArr.length - 1; j >= 0; j--) {
                if (this.attacksArr[j].type === "projectile") {
                    if (isColliding(this.enemies[i], this.attacksArr[j])) {

                        this.enemies[i].takeDamage(this.attacksArr[j].damage);

                        this.attacksArr.splice(j, 1);

                        if (this.enemies[i].health <= 0) {
                            this.player.addPoints(this.enemies[i].pointValue)
                            this.enemies.splice(i, 1)
                            i--
                        }

                        break;
                    }
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
        this.handlPlayerAttackCollisions();
        this.handleEnemyOnEnemy();
        this.handlePlayerOnEnemyCollisions();
        this.handlePowerUpCollisions();
    }

}