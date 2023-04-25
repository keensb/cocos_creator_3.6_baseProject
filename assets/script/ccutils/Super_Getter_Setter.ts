//从egret引擎移植过来的 执行对super的setter操作
//例如 ClassSon 覆盖了 ClassSuper 的 set a(value:number), superSetter 可以实现调用原始的 set a()

 


export function superSetter(currentClass: any, thisObj: any, type: string, value: any) {
    var cla = currentClass.prototype;
    var seters;
    if (!currentClass.hasOwnProperty("__sets__")) {
        Object.defineProperty(currentClass, "__sets__", { "value": {} });
    }
    seters = currentClass["__sets__"];
    var setF = seters[type];
    if (setF) {
        return setF.call(thisObj, value);
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
    setF.call(thisObj, value);
}


//从egret引擎移植过来的 执行对super的getter操作
//例如 ClassSon 覆盖了 ClassSuper 的 get a():number时  superGetter 可以实现调用原始的 get a()
export function superGetter(currentClass: any, thisObj: any, type: string) {
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


export function getObjectSetter(currentClass: any, type: string): any {
    var cla = currentClass.prototype;
    var seters;
    if (!currentClass.hasOwnProperty("__sets__")) {
        Object.defineProperty(currentClass, "__sets__", { "value": {} });
    }
    seters = currentClass["__sets__"];
    var setF = seters[type];
    if (setF) {
        return setF;
    }
    var d = Object.getPrototypeOf(cla);
    if (d == null) {
        return undefined;
    }
    while (!d.hasOwnProperty(type)) {
        d = Object.getPrototypeOf(d);
        if (d == null) {
            return undefined;
        }
    }
    setF = Object.getOwnPropertyDescriptor(d, type).set;
    seters[type] = setF;
    return setF;
}


export function getObjectGetter(currentClass: any, type: string): any {
    var cla = currentClass.prototype;
    var geters;
    if (!currentClass.hasOwnProperty("__gets__")) {
        Object.defineProperty(currentClass, "__gets__", { "value": {} });
    }
    geters = currentClass["__gets__"];
    var getF = geters[type];
    if (getF) {
        return getF;
    }
    var d = Object.getPrototypeOf(cla);
    if (d == null) {
        return undefined;
    }
    while (!d.hasOwnProperty(type)) {
        d = Object.getPrototypeOf(d);
        if (d == null) {
            return undefined;
        }
    }
    getF = Object.getOwnPropertyDescriptor(d, type).get;
    geters[type] = getF;
    return getF;
}


