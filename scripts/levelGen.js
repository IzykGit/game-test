// import { LevelTile } from "../classes/Level"

// export const generateLevel = (ctx, canvas) => {

//     let levelMap = []
//     let numRows = Math.floor(canvas.width / 32);
//     let numCols = Math.floor(canvas.height / 32);
//     for(let i = 0; i < numRows; i++) {
//         const row = []
//         for(let j = 0; j < numCols; j++) {
//             const tileType = Math.random() > 0.5 ? 1 : 0;
//             row.push(tileType);
//         }
//         levelMap.push(row);
//     }



//     for (let row = 0; row < levelMap.length; row++) {
//         for (let col = 0; col < levelMap[row].length; col++) {
//             const tile = levelMap[row][col];
//             if (tileType === 1) {
//                 const grassTile = new LevelTile(
//                     col * tileSize,
//                     row * tileSize,
//                     1.1,
//                     "green",        
//                     "grass"         
//                 );

//                 grassTile.drawTile(ctx);
//             }
//         }
//     }

//     return levelMap;
// }