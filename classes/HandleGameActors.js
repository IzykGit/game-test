import { collisionCheck, isColliding } from "../scripts/Collisions.js";

export class HandleGameActors {
    constructor (player, canvas, ctx) {
        this.player = player
        this.canvas = canvas;
        this.ctx = ctx;

        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];        
        
        this.frictionConstant = 0.9;
        this.gravityConstant = 4000;


        this.eventBus = new EventTarget()
    }

    get allEntities() {
        return [this.player, this.entities]
    }

    get allActors() {
        return [this.player, this.entities, this.powerUps]
    }

    addEnemy(enemy) {
        this.enemies.push(enemy)
    }

    addProjectile(projectile) {
        this.projectiles.push(projectile);
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

        this.player.velocityX *= Math.pow(this.frictionConstant, deltaTime); 

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

            this.enemies[i].velocityX *= Math.pow(this.frictionConstant ^ deltaTime); 
        }
    }

    applyProjectileAcceleration() {
        for(let i = 0; i < this.projectiles.length; i++) {
            if(this.projectiles[i].direction === 1) {
                this.projectiles[i].x -= 10
            }
            if(this.projectiles[i].direction === 2) {
                this.projectiles[i].x += 10;
            }
        }
    }
    

    handleEntityCollisions() {

        const entities = this.allEntities;

        for(let i = 0; i < entities.length; i++) {
            for(let j = i + 1; j < entities.length; j++) {

                const collideState = collisionCheck(entities[i], entities[j]);

                switch(collideState) {
                    case 1:
                        entities[i].x = entities[j].x + entities[j].width;
                        break;
                    case 2:
                        entities[i].x = entities[j].x - entities[i].width;
                        break;
                    case 3:
                        entities[i].y = entities[j].y + entities[j].height; 
                        entities[i].velocityY = 0;
                        break;
                    case 4:
                        entities[i].y = entities[j].y - entities[i].height; 
                        entities[i].velocityY = 0; 
                }
            }
        }
    }



    handleProjectileCollisions = () => {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = 0; j < this.projectiles.length; j++) {
                if (isColliding(this.enemies[i], this.projectiles[j])) {        
                    this.enemies[i].health -= this.projectiles[j].damage;
                    this.damageSound.currentTime = 0;
                    this.damageSound.play();
                    this.projectiles.splice(j, 1);
                    j--;
                }
            }
        }
    }



    handlePowerUpCollisions = () => {    
        for (let i = this.powerUps.length - 1; i >= 0; i--) {        
            if (isColliding(this.player, this.powerUps[i])) {
                switch (powerUp[i].type) {
                    case "health":
                        this.player.playerHealth += 20;
                        break;
                    default:
                        break;
                }
            }
        }
    };

    updatePowerUps = () => {    
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

        for(let i = 0; i < this.projectiles.length; i++) {
            console.log(this.projectiles[i])
            this.ctx.fillStyle = this.projectiles[i].color;
            this.ctx.fillRect(this.player.x, this.player.y, this.projectiles[i].width, this.projectiles[i].height);
        }
    }




    updateActors(deltaTime) {
        this.applyGravity(deltaTime);
        this.applyInertia(deltaTime);
        this.applyProjectileAcceleration(deltaTime);

        this.handleProjectileCollisions();

        this.handleEntityCollisions();
        this.handlePowerUpCollisions();

        this.updatePowerUps();
        this.drawActors();
    }
}