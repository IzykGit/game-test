

export const collisionCheck = (object1, object2) => {

    if (
        object1.x <= object2.x + object2.width &&
        object1.x  + object1.width >= object2.width &&
        object1.y <= object2.y + object2.height &&
        object1.y + object1.height >= object2.height
    ) {
        const overlapLeft = object2.x + object2.width - object1.x; 
        const overlapRight = object1.x + object1.width - object2.x; 
        const overlapTop = object2.y + object2.height - object1.y; 
        const overlapBottom = object1.y + object1.height - object2.y; 

        const smallest = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

        if (smallest === overlapLeft) {
            return 1; // left
        } else if (smallest === overlapRight) {
            return 2; // right
        } else if (smallest === overlapTop) {
            return 3; // top
        } else {
            return 4; //bottom
        }
    }

    return null;
}


export const isColliding = (a, b) => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}