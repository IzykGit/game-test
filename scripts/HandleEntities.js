import { Entity } from "../classes/Entities.js";
import { Projectile } from "../classes/Projectile.js";
import { Player } from "../classes/Player.js";
import { canvas, ctx } from "../script.js";
import { PowerUps } from "../classes/PowerUps.js";


const player = new Player(50, 300, 40, 90, "blue");

const entities = [];
const projectiles = [];
const powerUpsOnGround = [];

let powerUpsData = null;

const initializePowerUps = async () => {
    const response = await fetch('../jsons/power_ups.json');
    powerUpsData = await response.json();
};

initializePowerUps();

const collidingWith = new Set();

const deathSound = new Audio("../assets/sounds/death.wav");
const attackSound = new Audio("../assets/sounds/laserShoot.wav")
const enemydeathSound = new Audio("../assets/sounds/enemyDeath.wav")


const scoreBoard = document.getElementById("player-score")
scoreBoard.innerHTML = "Score: 0";



const isColliding = (a, b) => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


let enemySpawnInterval = 2000;
let lastSpawnTime = 0;
let spawnNumber = 2;

let lastPowerupScore = 0;

const updateInterval = () => {
    if (enemySpawnInterval >= 1000) {
        return enemySpawnInterval -= player.score;
    }

    if (spawnNumber === 6) {
        return;
    }
    else {
        return spawnNumber += 1;
    }
}

const spawnEnemy = () => {
    const x = Math.random() * (canvas.width - 40); 
    const y = -30;
    const enemy = new Entity(x, y, 40, 100, "red", true);
    entities.push(enemy);
}

export const createProjectile = (direction) => {
    const projectile = new Projectile(player.x, player.y, direction);
    attackSound.currentTime = 0;
    attackSound.play()

    projectile.drawProjectile(ctx);
    projectiles.push(projectile)
}


const getRandomPowerUp = () => {
    if (!powerUpsData) return null;
    const randomIndex = Math.floor(Math.random() * powerUpsData.length);
    return powerUpsData[randomIndex];
};

const spawnPowerup = async () => {
    const x = Math.random() * (canvas.width - 40); 
    const y = -30;

    const randomPowerUp = getRandomPowerUp();
    console.log(randomPowerUp)

    const powerUp = new PowerUps(x, y, randomPowerUp.type, randomPowerUp.color)
    powerUpsOnGround.push(powerUp)
}

export const updatePowerUps = () => {
    if (player.score >= lastPowerupScore + 200) {
        spawnPowerup();
        lastPowerupScore += 200;
    }

    if (powerUpsOnGround.length > 0) {
        for (let i = powerUpsOnGround.length - 1; i >= 0; i--) {
            const powerUp = powerUpsOnGround[i];
            powerUp.applyGravity(canvas);
            powerUp.draw(ctx);
    
            if (powerUp.y > canvas.height) {
                powerUpsOnGround.splice(i, 1);
            }
        }
    }
}


export const updateEntities = (currentTime) => {

    if (currentTime - lastSpawnTime > enemySpawnInterval && entities.length < spawnNumber) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    if(entities.length > 0) {
        for (let i = entities.length - 1; i >= 0; i--) {
            const enemy = entities[i];
            enemy.move(player.x, player.y, player.width);
            enemy.applyGravity(canvas);
    
    
            enemy.draw(ctx);
    
            if (enemy.health === 0) {
                enemydeathSound.play();
                player.score += 15;
                scoreBoard.innerHTML = `Score: ${player.score}`
                updateInterval()
                entities.splice(i, 1)
            }
    
            if (enemy.y > canvas.height) {
                entities.splice(i, 1);
            }
        }
    }

    if (projectiles.length > 0) {
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
    
            projectile.drawProjectile(ctx);
            projectile.accelerate(player.x, player.y);
    
            if (
                projectile.y < 0 ||
                projectile.y > canvas.height ||
                projectile.x < 0 ||
                projectile.x > canvas.width
            ) {
                projectiles.splice(i, 1);
            }
        }
    }

    
}


const handlePowerUpCollisions = () => {
    if (powerUpsOnGround.length === 0) return;

    for (let i = powerUpsOnGround.length - 1; i >= 0; i--) {

        const powerUp = powerUpsOnGround[i];
    
        if (isColliding(player, powerUp)) {
            switch (powerUp.type) {
                case "Health":
                    player.playerHealth += 20;
                    break;
            }
            powerUpsOnGround.splice(i, 1);
        }
    }
};




const detectCollisions = () => {

    if (entities.length > 0) {
        collidingWith.clear();

        for (const entity of entities) {
            if (entity.isSolid && isColliding(player, entity)) {
                collidingWith.add(entity);
            }
        }
    
    
        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                if (entities[i].isSolid && entities[j].isSolid && 
                    isColliding(entities[i], entities[j])) {
                    entities[i].handleCollide(entities[j]);
                }
            }
        }
    }
    

    if (projectiles.length > 0 && entities.length > 0) {
        for (let i = 0; i < entities.length; i++) {
            for (let j = 0; j < projectiles.length; j++) {
                if (
                    entities[i].isSolid && 
                    isColliding(entities[i], projectiles[j])
                ) {        
                    entities[i].handleCollide(projectiles[j]);
                    projectiles.splice(j, 1);
                    j--;
                }
            }
        }
    }


      

    return null;
}

export const resetGameEntities = () => {
    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.playerHealth = 100;

    entities.length = 0;
    collidingWith.clear();
}


const keys = {}; 

export const handlePlayer = () => {

    if(player.playerHealth === 0) {
        deathSound.play();
        player.hasSpawned = false;
        player.score = 0;
        scoreBoard.innerHTML = "Score: 0"
        return 0;
    }

    player.hasSpawned = true;
    player.applyGravity(canvas);
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

    handlePowerUpCollisions();
    detectCollisions();
    
    player.move(keys, canvas, collidingWith); 

    player.drawPlayer(ctx);
    player.drawHealthBar(ctx)
}


let canAttack = true;

document.addEventListener("keydown", (event) => {    
    if (!player.hasSpawned) return;
    keys[event.key] = true;

    if (event.key === " ") {
        player.jump();
    }

    if (event.key === "ArrowLeft" && player.playerHealth > 0 && canAttack) {
        createProjectile(2)
        canAttack = false;
    }
    if(event.key === "ArrowRight" && player.playerHealth > 0 && canAttack) {
        createProjectile(1)
        canAttack = false;
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;

    if (event.key === " ") {
        player.canJump = true;
    }


    if (event.key === "ArrowLeft" && player.playerHealth > 0) {
        canAttack = true;
    }
    if(event.key === "ArrowRight" && player.playerHealth > 0) {
        canAttack = true;
    }
});



