// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Helloworld from "./Helloworld";
import { Box } from "./Tool/Box";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PieceCp extends cc.Component {
    @property(cc.Node)
    pieceNode:cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    _data = null;
    doInit(data){
        this._data = data;
        switch(data.type){
            case 0:
                this.pieceNode.color = cc.Color.WHITE;
                break;
            case 1:
                this.pieceNode.active = false;
                break;
            case 2:
                this.pieceNode.color = cc.Color.RED;
                break;
            case 3:
                this.pieceNode.color = cc.Color.YELLOW;
                this.node.getChildByName("valueLabel").getComponent(cc.Label).string = "起点";
                break;
            default:
                break;
        }
    }

    // update (dt) {}

    onBtnClick(){
        if(this._data&&this._data.type == 0){
            if(Box.get(Helloworld).canClickPiece&&this._data.type == 0){
                Box.get(Helloworld).canClickPiece = false;
                this._data.type = 4;
                this.pieceNode.color = cc.Color.YELLOW;
                this.node.getChildByName("valueLabel").getComponent(cc.Label).string = "终点";
                Box.get(Helloworld).setEndPos(this._data);
            }
        }
    }

    setIsWay(){
        if(this._data.type == 0){
            this.pieceNode.color = cc.Color.GREEN;
        }
    }
}
