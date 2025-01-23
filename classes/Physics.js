export class Physics {
    constructor(gameState, canvas) {
        this.canvas = canvas;
        const { player, enemies, attacksArr, powerUps } = gameState;

        this.player = player;
        this.enemies = enemies;
        this.attacksArr = attacksArr;
        this.powerUps = powerUps;  

        this.frictionConstant = 0.9;
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
        if(this.enemies.length > 0) {
            for(let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].velocityY += this.gravityConstant * this.deltaTime;
                this.enemies[i].y += this.enemies[i].velocityY * this.deltaTime;
    
                if (this.enemies[i].y + this.enemies[i].height >= this.canvas.height) {
                    this.enemies[i].y = this.canvas.height - this.enemies[i].height;
                    this.enemies[i].velocityY = 0;
                }                
            }
        }

        if(this.powerUps.length > 0) {
            for(let i = 0; i < this.powerUps.length; i++) {
                this.powerUps[i].velocityY += this.gravityConstant * this.HandleGameActors.deltaTime;
                this.powerUps[i].y += this.powerUps[i].velocityY * this.HandleGameActors.deltaTime;
    
                if (this.powerUps[i].y + this.powerUps[i].height >= this.canvas.height) {
                    this.powerUps[i].y = this.canvas.height - this.powerUps[i].height;
                    this.powerUps[i].velocityY = 0;
                }
            }
        }
    }


    applyInertia() {

        this.player.velocityX -= this.player.velocityX * this.frictionConstant * this.deltaTime;

        if (this.player.x + this.player.width >= this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width; 
            this.player.velocityX = 0;
        }
        if (this.player.x < 0) {
            this.player.velocityX = 0;
            this.player.x = 0;
        }

        this.player.velocityX *= this.frictionConstant ** this.deltaTime; 

        for(let i = 0; i < this.enemies.length; i++) {
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
    }

    applyAttackAcceleration() {
        for(let i = 0; i < this.attacksArr.length; i++) {
            if(this.attacksArr[i].direction === 1) {
                this.attacksArr[i].x -= this.attacksArr[i].attackSpeed * this.deltaTime;
            }
            if(this.attacksArr[i].direction === 2) {
                this.attacksArr[i].x += this.attacksArr[i].attackSpeed * this.deltaTime;
            }
        }
    }

    outOfBounds() {
        if(this.attacksArr.length === 0) return;
        for(let i = this.attacksArr.length - 1; i >= 0; i--) {
            if(this.attacksArr[i].x < 0 || this.attacksArr[i].x + this.attacksArr[i].width >= this.canvas.width) {
                this.attacksArr.splice(i, 1);
            }
        }
    }


    updatePhysics(deltaTime) {
        this.applyGravity();
        this.applyInertia();
        this.applyAttackAcceleration();
        this.outOfBounds();
        
        this.deltaTime = deltaTime;
    }
}