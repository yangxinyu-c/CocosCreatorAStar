// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { LogError } from "./Const";
import Helloworld from "./Helloworld";
import PieceCp from "./PieceCp";
import { Box } from "./Tool/Box";
import { WayFinding } from "./Tool/WayFinding";


export class GameWorld {

    mapData = {width:0,height:0,data:[]}

    startPos = null;
    endPos = null;

    constructor(){

    }

    doInit(){
        this.initMap();
    }

    initMap(){
        this.mapData.data = [];
        let startIndex = Math.round(Math.random()*30);
        let hasOneStart = false;
        for(let i = -10;i<=10;i++){
            for(let j = -5;j<=5;j++){
                let object = {posX:i,posY:j,type:0,node:null};
                startIndex--;
                if(Math.random()*100>60){
                    object.type = Math.round(Math.random()*2);
                }

                if(startIndex <= 0 && !hasOneStart){
                    object.type = 3;
                    this.startPos = object;
                    hasOneStart = true;
                }
                this.mapData.data.push(object);
            }
        }
        LogError(this.mapData.data);
    }

    reset(){
        this.initMap();
    }

    update (dt) {}

    setEndPos(obj){
        this.endPos = obj;
    }

    wayList = [];
    findWay(){
        this.wayList = [];
        let wF = new WayFinding();
        wF.doInit(this.mapData.data);
        wF.setCb((type,list)=>{
            if(type == 0){
                LogError("路径找到",list);
                this.wayList = list;
                this.wayList.reverse();
                this.changUi();

            }else{
                Box.get(Helloworld).canReset = true;
                if(type == -1){
                    LogError("路径没找到",list)
                    Box.get(Helloworld).setTipsLabelStr("路径没找到");
                }else if(type == -2){
                    LogError("查找时间耗尽",list)
                    Box.get(Helloworld).setTipsLabelStr("查找路劲时间耗尽");
                }else{
                    LogError("路径没找到",list)
                    Box.get(Helloworld).setTipsLabelStr("路径没找到");
                }
            }
        });
        wF.setFindingData(this.startPos,this.endPos);
    }

    changUi(){
        if(this.wayList.length<=0){
            Box.get(Helloworld).canReset = true;
            return;
        }
        let obj = this.wayList.shift();
        this.mapData.data.forEach((v)=>{
            if(v.posX == obj.x&&v.posY == obj.y){
                // v.node.active = false;
                v.node.getComponent(PieceCp).setIsWay();
            }
        })
        Box.get(Helloworld).timeCb(()=>{
            this.changUi();
        },0.5)
    }
}
