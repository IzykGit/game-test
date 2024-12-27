import { Entity } from "../classes/Entities.js";
import { Projectile } from "../classes/Projectile.js";
import { Player } from "../classes/Player.js";
import { canvas, ctx } from "../script.js";


const player = new Player(50, 300, 40, 90, "blue", 1);

const entities = [];
const projectiles = [];

const collidingWith = new Set();

let playerScore = 0;

const deathSound = new Audio("../assets/sounds/death.wav");
const attackSound = new Audio("../assets/sounds/laserShoot.wav")
const enemydeathSound = new Audio("../assets/sounds/enemyDeath.wav")



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

const updateInterval = () => {
    if (enemySpawnInterval >= 1000) {
        return enemySpawnInterval -= playerScore;
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


export const updateEntities = (currentTime) => {

    if (currentTime - lastSpawnTime > enemySpawnInterval && entities.length < spawnNumber) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    for (let i = entities.length - 1; i >= 0; i--) {
        const enemy = entities[i];
        enemy.move(player.x, player.y, player.width);
        enemy.applyGravity(canvas);


        enemy.draw(ctx);

        if (enemy.health === 0) {
            enemydeathSound.play();
            playerScore += 15;
            updateInterval()
            entities.splice(i, 1)
        }

        if (enemy.y > canvas.height) {
            entities.splice(i, 1);
        }
    }

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


const detectCollisions = () => {

    if(entities.length <= 0) return;

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


    if (projectiles.length === 0) return;

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
        return 0;
    }

    player.hasSpawned = true;
    player.applyGravity(canvas);
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

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



