export class Physics {
    constructor(gameState, canvas) {
        this.canvas = canvas;
        const { player, enemies, attacksArr, powerUps, enemyAttacksArr } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attacksArr = attacksArr;
        this.powerUps = powerUps;
        this.enemyAttacksArr = enemyAttacksArr;

        this.frictionConstant = 0.2;
        this.gravityConstant = 4000;

        this.deltaTime = 0
    }

    applyGravity = () => {
        this.player.velocityY += this.gravityConstant * this.deltaTime;
        this.player.y += this.player.velocityY * this.deltaTime;

        if (this.player.y + this.player.height >= this.canvas.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.velocityY = 0;
        }
        if (this.enemies.length > 0) {
            for (let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].velocityY += this.gravityConstant * this.deltaTime;
                this.enemies[i].y += this.enemies[i].velocityY * this.deltaTime;

                if(this.enemies[i].y + this.enemies[i].height >= this.canvas.height / 2 && this.enemies[i].type === "bug") {
                    this.enemies[i].y = (this.canvas.height / 2) - this.enemies[i].height;
                    this.enemies.velocityY = 0;
                }

                if (this.enemies[i].y + this.enemies[i].height >= this.canvas.height) {
                    this.enemies[i].y = this.canvas.height - this.enemies[i].height;
                    this.enemies[i].velocityY = 0;
                }
            }
        }

        if (this.powerUps.length > 0) {
            for (let i = 0; i < this.powerUps.length; i++) {
                this.powerUps[i].velocityY += this.gravityConstant * this.deltaTime;
                this.powerUps[i].y += this.powerUps[i].velocityY * this.deltaTime;

                if (this.powerUps[i].y + this.powerUps[i].height >= this.canvas.height) {
                    this.powerUps[i].y = this.canvas.height - this.powerUps[i].height;
                    this.powerUps[i].velocityY = 0;
                }
            }
        }

        if (this.attacksArr.length > 0) {
            for (let i = 0; i < this.attacksArr.length; i++) {
                if (this.attacksArr[i].type === "bomb") {
                    this.attacksArr[i].velocityY += this.gravityConstant * this.deltaTime;
                    this.attacksArr[i].y += this.attacksArr[i].velocityY * this.deltaTime;

                    if (this.attacksArr[i].y + this.attacksArr[i].height >= this.canvas.height) {
                        this.attacksArr[i].y = this.canvas.height - this.attacksArr[i].height;
                        this.attacksArr[i].velocityY = 0;
                    }
                }
            }
        }
    }


    applyInertia() {
        
        this.player.x += this.player.velocityX * this.frictionConstant


        if (this.player.x + this.player.width >= this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width;
            this.player.velocityX = 0;
        }
        if (this.player.x < 0) {
            this.player.velocityX = 0;
            this.player.x = 0;
        }

        this.player.velocityX *= this.frictionConstant ** this.deltaTime;

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].x += this.enemies[i].velocityX;

            if (this.enemies[i].x + this.enemies[i].width >= this.canvas.width) {
                this.enemies[i].x = this.canvas.width - this.enemies[i].width;
                this.enemies[i].velocityX = 0;
            }
            if (this.enemies[i].x < 0) {
                this.enemies[i].velocityX = 0;
                this.enemies[i].x = 0;
            }

            this.enemies[i].velocityX *= this.frictionConstant ** this.deltaTime;
        }

        for (let i = 0; i < this.attacksArr.length; i++) {
            if(this.attacksArr[i].type === "bomb" && this.attacksArr[i].isThrown) {
                this.attacksArr[i].x += this.attacksArr[i].velocityX;    
                this.attacksArr[i].velocityX *= this.frictionConstant ** this.deltaTime;
            }
        }
    }

    applyProjectileMechanics() {
        for (let i = 0; i < this.attacksArr.length; i++) {
            if (this.attacksArr[i].type === "projectile") {
                if (this.attacksArr[i].direction === 1) {
                    this.attacksArr[i].x -= this.attacksArr[i].speed * this.deltaTime;
                }
                if (this.attacksArr[i].direction === 2) {
                    this.attacksArr[i].x += this.attacksArr[i].speed * this.deltaTime;
                }
            }
        }
    }

    applyBombMechanics() {
        for (let i = this.attacksArr.length - 1; i >= 0; i--) {
            if (this.attacksArr[i].type === "bomb" && !this.attacksArr[i].isThrown) {
                if (this.attacksArr[i].direction === 1) {
                    this.attacksArr[i].velocityY = -1200;
                    this.attacksArr[i].velocityX -= this.attacksArr[i].speed * this.deltaTime;
                }
                if (this.attacksArr[i].direction === 2) {
                    this.attacksArr[i].velocityY = -1200;
                    this.attacksArr[i].velocityX += this.attacksArr[i].speed * this.deltaTime;
                }

                this.attacksArr[i].isThrown = true;
            }

            if(this.attacksArr[i].timer >= 0) {
                this.attacksArr[i].timer -= 0.6;
            }
            else {
                this.attacksArr.splice(i, 1)
            }
        }
    }

    applyEnemyAttackMechanics() {
        for(let i = 0; i < this.enemyAttacksArr.length; i++) {
            if (this.enemyAttacksArr[i].direction === 1) {
                this.enemyAttacksArr[i].x -= this.enemyAttacksArr[i].speed * this.deltaTime;
            }
            if (this.enemyAttacksArr[i].direction === 2) {
                this.enemyAttacksArr[i].x += this.enemyAttacksArr[i].speed * this.deltaTime;
            }
        }
    }


    outOfBounds() {
        for (let i = this.attacksArr.length - 1; i >= 0; i--) {
            if (this.attacksArr[i].x < 0 || this.attacksArr[i].x + this.attacksArr[i].width >= this.canvas.width) {
                this.attacksArr.splice(i, 1);
            }
        }

        for (let i = this.enemyAttacksArr.length - 1; i >= 0; i--) {
            if (this.enemyAttacksArr[i].x < 0 || this.enemyAttacksArr[i].x + this.enemyAttacksArr[i].width >= this.canvas.width) {
                this.enemyAttacksArr.splice(i, 1);
            }
        }
    }


    updatePowerUps() {
        if (this.powerUps.length > 0) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                if (this.powerUps[i].y > this.canvas.height) {
                    this.powerUps.splice(i, 1);
                }
            }
        }
    }


    updatePhysics(deltaTime) {
        this.applyGravity();
        this.applyInertia();
        this.applyProjectileMechanics();
        this.applyBombMechanics();
        this.applyEnemyAttackMechanics();
        this.outOfBounds();
        this.updatePowerUps();

        this.deltaTime = deltaTime;
    }
}