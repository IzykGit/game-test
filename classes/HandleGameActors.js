import { collidingSide, isColliding } from "../scripts/Collisions.js";
import { Attack } from "./Attack.js";
import { Enemy } from "./Enemy.js";

export class HandleGameActors {
    constructor (player, canvas, ctx) {
        this.player = player
        this.canvas = canvas;
        this.ctx = ctx;

        this.enemies = [];
        this.attacksArr = [];
        this.powerUps = [];   
                
        this.frictionConstant = 0.9;
        this.gravityConstant = 4000;

        this.eventBus = new EventTarget();
    }    

    addEnemy() {
        this.enemies.push(new Enemy(this.player.x, this.player.y, 20, 40, "red"))
    }

    addAttack(direction) {
        this.attacksArr.push(new Attack(this.player.x, this.player.y + 15, direction));
    }

    addPowerUp(powerUp) {
        this.powerUps.push(powerUp)
    }


    applyGravity = (deltaTime) => {  
        
        this.player.velocityY += this.gravityConstant * deltaTime;
        this.player.y += this.player.velocityY * deltaTime;

        if (this.player.y + this.player.height >= this.canvas.height) {
            this.player.y = this.canvas.height - this.player.height;
            this.player.velocityY = 0;
        }

        if(this.enemies.length > 0) {
            for(let i = 0; i < this.enemies.length; i++) {
                this.enemies[i].velocityY += this.gravityConstant * deltaTime;
                this.enemies[i].y += this.enemies[i].velocityY * deltaTime;
    
                if (this.enemies[i].y + this.enemies[i].height >= this.canvas.height) {
                    this.enemies[i].y = this.canvas.height - this.enemies[i].height;
                    this.enemies[i].velocityY = 0;
                }
            }
        }

        if(this.powerUps.length > 0) {
            for(let i = 0; i < this.powerUps.length; i++) {
                this.powerUps[i].velocityY += this.gravityConstant * deltaTime;
                this.powerUps[i].y += this.powerUps[i].velocityY * deltaTime;
    
                if (this.powerUps[i].y + this.powerUps[i].height >= this.canvas.height) {
                    this.powerUps[i].y = this.canvas.height - this.powerUps[i].height;
                    this.powerUps[i].velocityY = 0;
                }
            }
        }
    }


    applyInertia(deltaTime) {

        this.player.velocityX -= this.player.velocityX * this.frictionConstant * deltaTime;

        if (this.player.x + this.player.width >= this.canvas.width) {
            this.player.x = this.canvas.width - this.player.width; 
            this.player.velocityX = 0;
        }
        if (this.player.x < 0) {
            this.player.velocityX = 0;
            this.player.x = 0;
        }

        this.player.velocityX *= this.frictionConstant ** deltaTime; 

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

            this.enemies[i].velocityX *= this.frictionConstant ** deltaTime; 
        }
    }

    applyAttackAcceleration(deltaTime) {
        for(let i = 0; i < this.attacksArr.length; i++) {
            if(this.attacksArr[i].direction === 1) {
                this.attacksArr[i].x -= this.attacksArr[i].attackSpeed * deltaTime;
            }
            if(this.attacksArr[i].direction === 2) {
                this.attacksArr[i].x += this.attacksArr[i].attackSpeed * deltaTime;
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
    

    handleEntityCollisions() {  

        for(let i = 0; i < this.enemies.length; i++) {
            for(let j = i + 1; j < this.enemies.length; j++) {
                if(isColliding(this.enemies[i], this.enemies[j])) {
                    const collideState = collidingSide(this.enemies[i], this.enemies[j]);

                    switch(collideState) {
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

    handlePlayerOnEntityCollisions() {  

        for(let i = 0; i < this.enemies.length; i++) {
            if(isColliding(this.player, this.enemies[i])) {
                const collideState = collidingSide(this.player, this.enemies[i]);

                switch(collideState) {
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
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = 0; j < this.attacksArr.length; j++) {
                if (isColliding(this.enemies[i], this.attacksArr[j])) {        
                    this.enemies[i].health -= this.attacksArr[j].damage;
                    this.attacksArr.splice(j, 1);
                    j--;
                }
            }
        }

        for(let i = 0; i < this.attacksArr.length; i++) {

            if(this.attacksArr[i].x < 0 || this.attacksArr[i].x + this.attacksArr[i].width >= this.canvas.width) {
                this.attacksArr.slice(i, 1)
                i--;
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

    updatePowerUps() {    
        if (this.powerUps.length > 0) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {        
                if (this.powerUps[i].y > this.canvas.height) {
                    this.powerUps.splice(i, 1);
                }
            }
        }
    }

    drawActors() {
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height)

        for(let i = 0; i < this.enemies.length; i++) {
            this.ctx.fillStyle = this.enemies[i].color;
            this.ctx.fillRect(this.enemies[i].x, this.enemies[i].y, this.enemies[i].width, this.enemies[i].height);
        }

        for(let i = 0; i < this.powerUps.length; i++) {
            this.ctx.fillStyle = this.powerUps[i].color;
            this.ctx.fillRect(this.powerUps[i].x, this.powerUps[i].y, this.powerUps[i].width, this.powerUps[i].height)
        }

        for(let i = 0; i < this.attacksArr.length; i++) {
            this.ctx.fillStyle = this.attacksArr[i].color;
            this.ctx.fillRect(this.attacksArr[i].x, this.attacksArr[i].y, this.attacksArr[i].width, this.attacksArr[i].height);
        }
    }




    updateActors(deltaTime) {
        this.applyGravity(deltaTime);
        this.applyInertia(deltaTime);
        this.applyAttackAcceleration(deltaTime);
        this.outOfBounds();

        this.handlAttackCollisions();
        this.handleEntityCollisions();
        this.handlePlayerOnEntityCollisions();
        this.handlePowerUpCollisions();

        this.updatePowerUps();
        this.drawActors();
    }
}