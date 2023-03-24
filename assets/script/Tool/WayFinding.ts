// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { LogError } from "../Const";

class Point{

}

export  class WayFinding {
    public _dMap:Map<string,Map<string,Point>> = new Map();
    _startPos = null;
    _endPos = null;
    _openList = [];
    _closeList = [];
    _wayList = [];
    _recursionTimes = 0;

    constructor(){

    }

    cb = null;
    setCb(cb){
        this.cb = cb;
    }

    doInit(data){
        this._startPos = null;
        this._endPos = null;
        this._openList = [];
        this._closeList = [];
        this._wayList = [];
        this._recursionTimes = 10000;
        this.initTownMap(data);
    }

    initTownMap(data){
        this._dMap.clear();
        for(let i = 0;i<data.length;i++){
            if(this._dMap[data[i].posX+'']){
                this._dMap[data[i].posX+''][data[i].posY+''] = data[i];
            }else{
                this._dMap[data[i].posX+''] = new Map();
                this._dMap[data[i].posX+''][data[i].posY+''] =data[i];
            }
        }
        LogError("this._dMap",this._dMap);
    }

    setFindingData(startPos,endPos){
        this._startPos = startPos;
        this._endPos = endPos;


        let obj = this._getObj(this._startPos.posX,this._startPos.posY,null);
        let array = this._getRound(obj);
        array.forEach((v)=>{
            this._openList.push(v);
        })
        this._closeList.push(obj);
        
        if(!this._checkWayEnd()){
            this._nextFind();
        }
    }

    _nextFind(){
        this._openList.sort((a,b)=>{
            return a.f- b.f;
        })
        let obj = this._openList.shift();
        let array = this._getRound(obj);
        array.forEach((v)=>{
            this._openList.push(v);
        })
        this._closeList.push(obj);
        this._recursionTimes--;
        if(this._recursionTimes<0){
            LogError("查找时间耗尽");
            this.cb&&this.cb(-2,null);
            return;
        }
        if(!this._checkWayEnd()){
            this._nextFind();
        }
    }

    _getObj(x,y,parent){
        let obj = {x:x,y:y,f:0,parent:parent};
        this._setF(obj);
        return obj;
    }

    _setF(obj){
        let f = Math.abs(obj.x-this._endPos.posX)+Math.abs(obj.y-this._endPos.posY);
        obj.f = f;
    }

    _getRound(obj){
        let up =  {x:obj.x,y:obj.y,f:0,parent:null};
        let down = {x:obj.x,y:obj.y,f:0,parent:null};
        let left = {x:obj.x,y:obj.y,f:0,parent:null};
        let right = {x:obj.x,y:obj.y,f:0,parent:null};
        up.y+=1;
        down.y-=1;
        left.x-=1;
        right.x+=1;
        this._setF(up);
        this._setF(down);
        this._setF(left);
        this._setF(right);
        let array = [];
        if(this._isCanMove(up)){
            if(!this._openArrayHasObj(up)&&!this._closArrayHasObj(up)){
                up.parent = obj;
                array.push(up);
            }
        }
        if(this._isCanMove(down)){
            if(!this._openArrayHasObj(down)&&!this._closArrayHasObj(down)){
                down.parent = obj;
                array.push(down);
            }
        }
        if(this._isCanMove(left)){
            if(!this._openArrayHasObj(left)&&!this._closArrayHasObj(left)){
                left.parent = obj;
                array.push(left);
            }
        }
        if(this._isCanMove(right)){
            if(!this._openArrayHasObj(right)&&!this._closArrayHasObj(right)){
                right.parent = obj;
                array.push(right);
            }
        }
        return array;
    }

    _isCanMove(obj){
        if(this._dMap[obj.x]&&this._dMap[obj.x][obj.y]){
            if(this._dMap[obj.x][obj.y].type == 0||this._dMap[obj.x][obj.y].type == 3||this._dMap[obj.x][obj.y].type == 4){
                return true;
            }

        }
        return false;
    }

    _checkWayEnd(){
        let hasFind = false;
        if(this._openList.length == 0){
            LogError("没有路径");
            this.cb&&this.cb(-1,null)
            hasFind = true;
        }
        this._openList.forEach((obj)=>{
            if(obj.x == this._endPos.posX&&obj.y == this._endPos.posY){
                hasFind = true;
                LogError("找到路径了");
                this._setWayList(obj);
                this.cb&&this.cb(0,this._wayList);
                return hasFind;
            }
        })

        return hasFind;
    }

    _openArrayHasObj(obj){
        let isHas = false;
        this._openList.forEach((v)=>{
            if(v.x == obj.x && v.y == obj.y){
                isHas = true;
                return isHas;
            }
        });
        return isHas;
    }

    _closArrayHasObj(obj){
        let isHas = false;
        this._closeList.forEach((v)=>{
            if(v.x == obj.x && v.y == obj.y){
                isHas = true;
                return isHas;
            }
        });
        return isHas;
    }

    _pushTimes = 0;
    _setWayList(obj){
        this._pushTimes = 1000;
        this._wayList = [];
        this._wayList.push(obj);
        this._pushNextObj(obj);
        LogError(this._wayList)
    }

    _pushNextObj(obj){
        if(this._pushTimes>0){
            this._pushTimes--;
            if(!obj.parent){
                return;
            }
            this._wayList.push(obj.parent);
            this._pushNextObj(obj.parent);
        }
    }
}