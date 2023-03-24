// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html


export  class Const {
    pScale = 0.5;
    pieceWidth = 100;
    pieceHeight = 100;
}

export let gConst = new Const();

export function LogError(...args){
    console.error(args);
}

// export enum PieceType{
//     normal = 0,
//     none = 1
// }
