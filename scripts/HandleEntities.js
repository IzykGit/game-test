import { Entity } from "../classes/Entities.js"
import { Player } from "../classes/Player.js";
import { canvas, ctx } from "../script.js";


const player = new Player(50, 300, 30, 30, "blue", 1);

const entities = [];

const collidingWith = new Set();





const enemySpawnInterval = 2000;
let lastSpawnTime = 0;

const spawnEnemy = () => {
    const x = Math.random() * (canvas.width - 32); 
    const y = -30;
    const enemy = new Entity(x, y, 32, 32, "red", true);
    entities.push(enemy);
}


export const updateEntities = (currentTime) => {

    if (currentTime - lastSpawnTime > enemySpawnInterval && entities.length < 5) {
        spawnEnemy(canvas);
        lastSpawnTime = currentTime;
    }

    for (let i = entities.length - 1; i >= 0; i--) {
        const enemy = entities[i];
        enemy.move();
        enemy.applyGravity(canvas);
        enemy.handleCollide(collidingWith);
        enemy.draw(ctx);


        if (enemy.y > canvas.height) {
            entities.splice(i, 1);
        }
    }
    
}


const detectCollisions = () => {

    if(entities.length <= 0) return;

    collidingWith.clear();

    for (const entity of entities) {
        if (
            entity.isSolid &&
            player.x < entity.x + entity.width &&
            player.x + player.width > entity.x &&
            player.y < entity.y + entity.height &&
            player.y + player.height > entity.y
        ) {
            collidingWith.add(entity)
        }

    }

    return null;
}


const keys = {}; 

export const handlePlayer = () => {
    player.applyGravity(canvas);
    player.handleCollide(collidingWith); 
    player.applyInertia(canvas);

    detectCollisions();
    
    player.move(keys, canvas, collidingWith); 

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



