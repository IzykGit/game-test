
export function collidingSide(object1, object2) {

    const ObjectOneCenterX = object1.x + object1.width / 2;
    const ObjectOneCenterY = object1.y + object1.height / 2;

    const ObjectTwoCenterX = object2.x + object2.width / 2;
    const ObjectTwoCenterY = object2.y + object2.height / 2;

    const deltaX = ObjectOneCenterX - ObjectTwoCenterX;
    const deltaY = ObjectOneCenterY - ObjectTwoCenterY;

    const combinedHalfWidths = (object1.width + object2.width) / 2;
    const combinedHalfHeights = (object1.height + object2.height) / 2;

    const overlapX = combinedHalfWidths - Math.abs(deltaX);
    const overlapY = combinedHalfHeights - Math.abs(deltaY);

    if (overlapX < overlapY) {
        if (deltaX > 0) {
            return 'left';
        } else {
            return 'right'; 
        }
    } else {
        if (deltaY > 0) {
            return 'top';
        } else {
            return 'bottom';
        }
    }
}


export const isColliding = (a, b) => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}