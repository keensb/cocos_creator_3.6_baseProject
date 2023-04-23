//从egret引擎移植过来的 执行对super的setter操作
//例如 ClassSuper 和 ClassSon 都实现了 set a(value:number)时  superSetter 可以实现调用原始的 a
export function superSetter(currentClass:any, thisObj:any, type:string, value:any) {
    var values = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        values[_i - 3] = arguments[_i];
    }
    var cla = currentClass.prototype;
    var seters;
    if (!currentClass.hasOwnProperty("__sets__")) {
        Object.defineProperty(currentClass, "__sets__", { "value": {} });
    }
    seters = currentClass["__sets__"];
    var setF = seters[type];
    if (setF) {
        return setF.apply(thisObj, values);
    }
    var d = Object.getPrototypeOf(cla);
    if (d == null) {
        return;
    }
    while (!d.hasOwnProperty(type)) {
        d = Object.getPrototypeOf(d);
        if (d == null) {
            return;
        }
    }
    setF = Object.getOwnPropertyDescriptor(d, type).set;
    seters[type] = setF;
    setF.apply(thisObj, values);
}


//从egret引擎移植过来的 执行对super的getter操作
//例如 ClassSuper 和 ClassSon 都实现了 get a():number时  superGetter 可以实现调用原始的 a
export function superGetter(currentClass:any, thisObj:any, type:string) {
    var cla = currentClass.prototype;
    var geters;
    if (!currentClass.hasOwnProperty("__gets__")) {
        Object.defineProperty(currentClass, "__gets__", { "value": {} });
    }
    geters = currentClass["__gets__"];
    var getF = geters[type];
    if (getF) {
        return getF.call(thisObj);
    }
    var d = Object.getPrototypeOf(cla);
    if (d == null) {
        return;
    }
    while (!d.hasOwnProperty(type)) {
        d = Object.getPrototypeOf(d);
        if (d == null) {
            return;
        }
    }
    getF = Object.getOwnPropertyDescriptor(d, type).get;
    geters[type] = getF;
    return getF.call(thisObj);
}



