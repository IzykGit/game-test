import { Entity } from "../classes/Entities.js";
import { Projectile } from "../classes/Projectile.js";
import { Player } from "../classes/Player.js";
import { canvas, ctx } from "../script.js";


const player = new Player(50, 300, 40, 90, "blue", 1);

const entities = [];
const projectiles = [];

const collidingWith = new Set();

const deathSound = new Audio("../sounds/death.wav");


const isColliding = (a, b) => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


const enemySpawnInterval = 2000;
let lastSpawnTime = 0;

const spawnEnemy = () => {
    const x = Math.random() * (canvas.width - 32); 
    const y = -30;
    const enemy = new Entity(x, y, 40, 100, "red", true);
    entities.push(enemy);
}

export const createProjectile = () => {
    const projectile = new Projectile(player.x, player.y);

    projectile.drawProjectile(ctx);
    projectiles.push(projectile)
}


export const updateEntities = (currentTime) => {

    if (currentTime - lastSpawnTime > enemySpawnInterval && entities.length < 5) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    for (let i = entities.length - 1; i >= 0; i--) {
        const enemy = entities[i];
        enemy.move(player.x, player.y);
        enemy.applyGravity(canvas);


        enemy.draw(ctx);


        if (enemy.y > canvas.height) {
            entities.splice(i, 1);
        }
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];

        projectile.drawProjectile(ctx);
        projectile.accelerate(player.x, player.y);

        if (projectile.y > canvas.width || projectile.y < canvas.width + projectile.width) {
            entities.splice(i, 1);
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


                entities[i].handleCollide(entities[j]);;
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
        return 0;
    }


    player.applyGravity(canvas);
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

    detectCollisions();
    
    player.move(keys, canvas, collidingWith); 
    player.attack(keys, ctx)

    player.drawPlayer(ctx);
    player.drawHealthBar(ctx)
}



document.addEventListener("keydown", (event) => {    
    keys[event.key] = true;

    if (event.key === " ") {
        player.jump();
    }
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;

    if (event.key === " ") {
        player.canJump = true;
    }
});



