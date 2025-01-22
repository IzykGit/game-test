

export class HandleTypes {
    constructor() {

        this.attackTypes = {};
        this.enemyTypes = {};
        this.powerUpTypes = {};

        this.currentAttack = {};

        this.getAttackTypes();
        this.getEnemyTypes();
        // this.getPowerUpTypes();

        this.eventBus = new EventTarget();
    }

    async getAttackTypes() {
        const response = await fetch("../configs/attacks.json");
        this.attackTypes = await response.json();
    }

    async getEnemyTypes() {
        const response = await fetch("../configs/enemies.json");
        this.enemyTypes = await response.json()
    }

    // async getPowerUpTypes () {
    //     const response = await fetch("../configs/powerUps.json");
    //     this.powerUpTypes = await response.json()
    // }

    passAttackTypes() {
        return this.attackTypes;
    }

    passEnemyTypes() {
        return this.enemyTypes;
    }

    passPowerUpTypes() {
        return this.powerUpTypes;
    }
}