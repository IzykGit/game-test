import { Enemy } from "../classes/Enemy.js";
import { Projectile } from "../classes/Projectile.js";
import { canvas, ctx } from "../script.js";
import { PowerUps } from "../classes/PowerUps.js";
import { applyGravity } from "../scripts/Gravity.js";
import { getPlayer } from "../global/PlayerValues.js";


const enemies = [];
const projectiles = [];
const powerUpsOnGround = [];

const entities = [getPlayer(), ...enemies]

let randomXAxisPoint = null; 

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

let playerScore = 0;



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
        return enemySpawnInterval -= playerScore;
    }

    if (spawnNumber === 4) {
        return;
    }
    else {
        return spawnNumber += 1;
    }
}

const spawnEnemy = () => {
    randomXAxisPoint = Math.random() * (canvas.width - 40)
    const y = -30;
    const enemy = new Enemy(randomXAxisPoint, y, 40, 100, "red", "grunt", true);
    enemies.push(enemy);
    entities.push(enemy)
}

export const createProjectile = (direction) => {

    const player = getPlayer()

    const projectile = new Projectile(player.x, player.y + 15, direction);
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

    const powerUp = new PowerUps(x, y, randomPowerUp.type, randomPowerUp.color)
    powerUpsOnGround.push(powerUp)
}

export const updatePowerUps = () => {
    if (playerScore >= lastPowerupScore + 200) {
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


export const updateAllEntities = (currentTime) => {

    const player = getPlayer();

    applyGravity(entities)

    if (currentTime - lastSpawnTime > enemySpawnInterval && enemies.length < spawnNumber) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    if(enemies.length > 0) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            enemy.move(player.x, player.y, player.width);
    
    
            enemy.draw(ctx);
    
            if (enemy.health === 0) {
                enemydeathSound.play();
                playerScore += 15;
                scoreBoard.innerHTML = `Score: ${playerScore}`
                updateInterval()
                enemies.splice(i, 1)
            }
    
            if (enemy.y > canvas.height) {
                enemies.splice(i, 1);
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

    const player = getPlayer();

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




const detectEnemyCollisions = () => {

    const player = getPlayer();

    collidingWith.clear();

    for (const entity of enemies) {
        if (entity.isSolid && isColliding(player, entity)) {
            collidingWith.add(entity);
        }
    }


    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            if (enemies[i].isSolid && enemies[j].isSolid && 
                isColliding(enemies[i], enemies[j])) {
                enemies[i].handleCollide(enemies[j]);
            }
        }
        
    }

    return null;
}


const detectProjectileCollisions = () => {

    if (projectiles.length > 0 && enemies.length > 0) {
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < projectiles.length; j++) {
                if (
                    enemies[i].isSolid && 
                    isColliding(enemies[i], projectiles[j])
                ) {        
                    enemies[i].handleCollide(projectiles[j]);
                    projectiles.splice(j, 1);
                    j--;
                }
            }
        }
    }

}


export const resetGameEntities = () => {

    const player = getPlayer();

    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.playerHealth = 100;

    enemySpawnInterval = 2000;
    enemies.length = 0;
    powerUpsOnGround.length = 0;
    collidingWith.clear();
}


const keys = {}; 

export const handlePlayer = () => {

    const player = getPlayer()

    if(player.playerHealth === 0) {
        deathSound.play();
        player.hasSpawned = false;
        playerScore = 0;
        scoreBoard.innerHTML = "Score: 0"
        return 0;
    }

    player.hasSpawned = true;
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

    if (powerUpsOnGround.length > 0) {
        handlePowerUpCollisions();
    }
    if (enemies.length > 0) {
        detectEnemyCollisions();
    }
    if (projectiles.length > 0) {
        detectProjectileCollisions()
    }
    
    player.move(keys, canvas, collidingWith); 

    player.drawPlayer(ctx);
    player.drawHealthBar(ctx)
}


let canAttack = true;

document.addEventListener("keydown", (event) => {    

    const player = getPlayer();

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

    const player = getPlayer();

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



