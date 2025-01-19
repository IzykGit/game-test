import { isColliding } from "../scripts/Collisions.js";
import { PowerUps } from "./PowerUps.js";
import { Projectile } from "./Projectile.js";

export class HandleGameActors {
    constructor (player, canvas, ctx) {
        this.player = player
        this.canvas = canvas;
        this.ctx = ctx;

        this.enemies = [];
        this.projectiles = [];
        this.powerUps = [];


        this.allEntities = [this.player, ...this.enemies];

        this.allActors = [...this.allEntities, ...this.powerUps]
        
        
        this.frictionConstant = 0.75;
        this.gravityConstant = 0.93;
    }

    addEnemy(enemy) {
        this.enemies.push(enemy)
    }


    addProjectile() {
        const projectile = new Projectile();
        this.projectiles.push(projectile);
    }


    applyGravity = () => {
        for(let i = 0; i < this.allActors.length; i++) {
            this.allActors[i].velocityY += this.gravityConstant;
            this.allActors[i].y += this.allActors[i].velocityY;
        
        
            if (this.allActors[i].y + this.allActors[i].height >= this.canvas.height) {
                this.allActors[i].y = this.canvas.height - this.allActors[i].height;
                this.allActors[i].velocityY = 0;
            }
        }
    }


    applyInertia() {

        for(let i = 0; i < this.allEntities.length; i++) {
            this.allEntities[i].x += this.velocityX;

            if (this.allEntities[i].x + this.width >= this.canvas.width) {
                this.allEntities[i].x = this.canvas.width - this.width;
                this.allEntities[i].velocityX = 0;
            }
            if (this.allEntities[i].x < 0) {
                this.allEntities[i].x = 0;
                this.allEntities[i].velocityX = 0;
            }
    
            this.allEntities[i].velocityX *= this.frictionConstant;
        }
    }
    

    handleEntityCollisions() {
        for(let i = 0; i < this.allEntities.length; i++) {
            for(let j = i + 1; j < this.allEntities.length; i++) {

                const collideState = collisionCheck(this.allEntities[i], this.allEntities[j]);

                switch(collideState) {
                    case 1:
                        this.allEntities[i].x = this.allEntities[j].x + this.allEntities[j].width;
                        break;
                    case 2:
                        this.allEntities[i].x = this.allEntities[j].x - this.allEntities[i].width;
                        break;
                    case 3:
                        this.allEntities[i].y = this.allEntities[j].y + thisl.allEntities[j].height; 
                        this.allEntities[i].velocityY = 0;
                        break;
                    case 4:
                        this.allEntities[i].y = this.allEntities[j].y - this,this.allEntities[i].height; 
                        this.allEntities[i].velocityY = 0; 
                }
            }
        }
    }



    handleProjectileCollisions = () => {
        if (this.projectiles.length > 0 && this.enemies.length > 0) {
            for (let i = 0; i < this.enemies.length; i++) {
                for (let j = 0; j < this.projectiles.length; j++) {
                    if (isColliding(this.enemies[i], this.projectiles[j])) {        
                        this.enemies[i].health -= this.projectiles[j].damage;
                        getDamageSound().currentTime = 0;
                        getDamageSound().play();
                        this.projectiles.splice(j, 1);
                        j--;
                    }
                }
            }
        }
    }



    handlePowerUpCollisions = () => {
        if (this.powerUps.length === 0) return;
    
        const player = getPlayer();
    
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
    
            const powerUp = this.powerUps[i];

        
            if (isColliding(player, powerUp)) {
                if(powerUp.type === "health") {
                    player.playerHealth += 20;
                }
                this.powerUps.splice(i, 1);
            }
        }
    };

    updatePowerUps = () => {    
        if (this.powerUps.length > 0) {
            for (let i = this.powerUps.length - 1; i >= 0; i--) {
                
                const powerUp = this.powerUps[i];

                powerUp.draw(ctx);
                powerUp.applyGravity(this.canvas);
        
                if (this.powerUps[i].y > this.canvas.height) {
                    powerUp.splice(i, 1);
                }
            }
        }
    }

    drawActors() {
        for(let i = 0; i < this.allEntities.length; i++) {
            this.ctx.fillStyle = this.allEntities[i].color;
            this.ctx.fillRect(this.allEntities[i].x, this.allEntities[i].y, this.allEntities[i].width, this.allEntities[i].height)
        }
    }


    spawnPowerUp(type, color) {
        const x = Math.random() * (this.canvas.width - 40);
        const powerUp = new PowerUps(x, -30, type, color);
        this.powerUps.push(powerUp);
    }

    updateActors() {
        this.applyGravity([this.player, ...this.enemies]);
        this.handleProjectileCollisions();
        this.handleEntityCollisions();
        this.handlePowerUpCollisions();
        this.updatePowerUps();
        this.drawActors();
    }
}