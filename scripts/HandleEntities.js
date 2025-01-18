import { Enemy } from "../classes/Enemy.js";
import { Projectile } from "../classes/Projectile.js";
import { canvas, ctx } from "../main.js";

import { getPlayer } from "../global/PlayerValues.js";





let randomXAxisPoint = null; 


const collidingWith = new Set();

const deathSound = new Audio("../assets/sounds/death.wav");
const attackSound = new Audio("../assets/sounds/laserShoot.wav")
const enemydeathSound = new Audio("../assets/sounds/enemyDeath.wav")


const scoreBoard = document.getElementById("player-score")
scoreBoard.innerHTML = "Score: 0";


let enemySpawnInterval = 2000;
let lastSpawnTime = 0;
let spawnNumber = 2;


const updateInterval = () => {

    const player = getPlayer()

    if (enemySpawnInterval >= 1000) {
        return enemySpawnInterval -= player.playerScore;
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
    const enemy = new Enemy(randomXAxisPoint, y, 40, 100, "red", true);
    entityManage.addEnemy(enemy)
}

export const createProjectile = (direction) => {

    const player = getPlayer()

    const projectile = new Projectile(player.x, player.y + 15, direction);
    attackSound.currentTime = 0;
    attackSound.play()

    projectile.drawProjectile(ctx);
    entityManage.addProjectile(projectile)
}



let scoreInterval = 200;

export const updateAllEntities = (currentTime) => {

    const player = getPlayer();

    entityManage.updateEntities();

    if (player.playerScore >= scoreInterval) {
        entityManage.spawnPowerUp("health", "purple");
        scoreInterval += 200;
    };

    if (currentTime - lastSpawnTime > enemySpawnInterval && entityManage.enemies.length < spawnNumber) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    if(entityManage.enemies.length > 0) {
        for (let i = entityManage.enemies.length - 1; i >= 0; i--) {
            const enemy = entityManage.enemies[i];
            enemy.move(player.x, player.y, player.width);
    
    
            enemy.draw(ctx);
    
            if (enemy.health === 0) {
                enemydeathSound.play();
                player.playerScore += 15;
                scoreBoard.innerHTML = `Score: ${player.playerScore}`
                updateInterval()
                entityManage.enemies.splice(i, 1)
            }
    
            if (enemy.y > canvas.height) {
                entityManage.enemies.splice(i, 1);
            }
        }
    }

    if (entityManage.projectiles.length > 0) {
        for (let i = entityManage.projectiles.length - 1; i >= 0; i--) {
            const projectile = entityManage.projectiles[i];
    
            projectile.drawProjectile(ctx);
            projectile.accelerate(player.x, player.y);
    
            if (
                projectile.y < 0 ||
                projectile.y > canvas.height ||
                projectile.x < 0 ||
                projectile.x > canvas.width
            ) {
                entityManage.projectiles.splice(i, 1);
            }
        }
    }

    
}






const detectEnemyCollisions = () => {

    const player = getPlayer();

    collidingWith.clear();

    for (const entity of entityManage.enemies) {
        if (entity.isSolid && isColliding(player, entity)) {
            collidingWith.add(entity);
        }
    }


    for (let i = 0; i < entityManage.enemies.length; i++) {
        for (let j = i + 1; j < entityManage.enemies.length; j++) {
            if (entityManage.enemies[i].isSolid && entityManage.enemies[j].isSolid && 
                isColliding(entityManage.enemies[i], entityManage.enemies[j])) {
                entityManage.enemies[i].handleCollide(entityManage.enemies[j]);
            }
        }
        
    }

    return null;
}





export const resetGameEntities = () => {

    const player = getPlayer();

    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.playerHealth = 100;

    enemySpawnInterval = 2000;
    entityManage.enemies.length = 0;
    entityManage.powerUps.length = 0;
    collidingWith.clear();
}


const keys = {}; 

export const handlePlayer = () => {

    const player = getPlayer()

    if(player.playerHealth === 0) {
        deathSound.play();
        player.hasSpawned = false;
        player.playerScore = 0;
        scoreBoard.innerHTML = "Score: 0"

        entityManage.projectiles.length = 0;
        entityManage.enemies.length = 0;
        return 0;
    }

    player.hasSpawned = true;
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

    if (powerUpsOnGround.length > 0) {
        handlePowerUpCollisions();
    }
    if (entityManage.enemies.length > 0) {
        detectEnemyCollisions();
    }
    if (entityManage.projectiles.length > 0) {
        entityManage.detectProjectileCollisions()
    }
    
    player.move(keys, canvas, collidingWith); 

    player.drawPlayer(ctx);
    player.drawHealthBar(ctx)
}





