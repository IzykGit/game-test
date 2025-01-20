





let randomXAxisPoint = null; 


const collidingWith = new Set();

const deathSound = new Audio("../assets/sounds/death.wav");
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





