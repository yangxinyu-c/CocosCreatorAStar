

export type ObjectConstructor<T> ={new(...args): T; }
export class Box {
    private static boxMap: any = {};

    public static add<T>(t: T ) {
        var id = getFunctionId(t.constructor);

        if (this.boxMap[id]) {
            let a = 0;
            let hasString = "box has " + id + " " + t.constructor;
            console.error(hasString);
        }
        this.boxMap[id] = t;
    }

    public static remove<T>(t : T) {
        var c = getFunctionId(t.constructor);
        delete this.boxMap[c];
    }
    public static get<T>(constructor : ObjectConstructor<T> ) : T {
        let ret = this.boxMap[getFunctionId(constructor)];
        if (ret) {
            return ret;
        }
    }
}

var  FunctionId = 1;
var Id2FunctionMap = {};

export function getFunctionId(f : any) : number{

    if (f.hasOwnProperty('id')) {
        return f.id;
    }
    else {
        ++FunctionId;
        f['id'] = FunctionId;
        Id2FunctionMap[FunctionId] = f;
        return FunctionId
    }
}
