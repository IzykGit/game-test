import { HandleTypes } from "./HandleTypes.js";

export class Attack extends HandleTypes {
    constructor(x, y, direction) {
        super()
        this.x = x;
        this.y = y;
        this.direction = direction;

        this.damage = 20;

        this.attackSpeed = 800;

        this.color = "grey"

        this.width = 15;
        this.height = 15;
        this.velocityX = 0;

    }
}