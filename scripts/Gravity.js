import { canvas } from "../script.js";


const gravityConstant = 0.93

export const applyGravity = (entities) => {

    for(const entity of entities) {
        entity.velocityY += gravityConstant;
        entity.y += entity.velocityY;
    
    
        if (entity.y + entity.height >= canvas.height) {
            entity.y = canvas.height - entity.height;
            entity.velocityY = 0;
        }
    }
}