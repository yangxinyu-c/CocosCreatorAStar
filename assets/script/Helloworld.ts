import { gConst, LogError } from "./Const";
import { GameWorld } from "./GameWorld";
import PieceCp from "./PieceCp";
import { Box } from "./Tool/Box";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {
    gameWorld:GameWorld = null;

    @property(cc.Node)
    gameScene:cc.Node = null;

    @property([cc.Prefab])
    preloadArray:cc.Prefab[] = [];

    @property(cc.Label)
    tipsLabel:cc.Label = null;

    canClickPiece = true;
    canReset = true;
    
    start () {
        Box.add(this);
        this.setTipsLabelStr("");
        this.gameScene.setScale(gConst.pScale);
        if(!this.gameWorld){
            this.gameWorld = new GameWorld();
            this.gameWorld.doInit();
            this.refreshMapByData();
        }
    }

    setTipsLabelStr(value:string){
        this.tipsLabel.string = value;
    }

    protected update(dt: number): void {
        if(this.gameWorld){
            this.gameWorld.update(dt);
        }
    }

    refreshMapByData(){
        this.gameScene.getChildByName("mapScene").removeAllChildren();
        for(let i = 0;i<this.gameWorld.mapData.data.length;i++){
            let obData = this.gameWorld.mapData.data[i];
            let pieceNode = cc.instantiate(this.preloadArray[0]);
            pieceNode.setPosition(obData.posX*gConst.pieceWidth,obData.posY*gConst.pieceHeight);
            obData.node = pieceNode;
            pieceNode.getComponent(PieceCp).doInit(obData);
            this.gameScene.getChildByName("mapScene").addChild(pieceNode);
        }
        LogError(this.gameWorld.mapData);
    }

    onBtnClick(event,data){
        switch(data){
            case "reset":{
                if(!this.canReset){
                    break;
                }
                this.gameWorld.reset();
                this.refreshMapByData();
                this.canClickPiece = true;
                this.setTipsLabelStr("");
                break;
            }
            default:
                break;
        }
            
    }

    setEndPos(endObj){
        this.canReset = false;
        this.gameWorld.setEndPos(endObj);
        this.scheduleOnce(()=>{
            this.gameWorld.findWay();
        },1)
    }

    timeCb(cb,dt){
        this.scheduleOnce(()=>{
            cb&&cb();
        },dt)
    }
}
